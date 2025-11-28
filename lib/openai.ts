import OpenAI from "openai";
import { createClient } from "@/lib/supabase/admin";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  cached?: boolean;
}

export async function getCachedResponse(key: string): Promise<any | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ai_cache")
    .select("response_json, created_at, ttl")
    .eq("key", key)
    .maybeSingle();

  if (error || !data) return null;

  // Check if cache is expired (default TTL: 7 days)
  const ttl = data.ttl || 7 * 24 * 60 * 60 * 1000;
  const age = Date.now() - new Date(data.created_at).getTime();
  if (age > ttl) {
    await supabase.from("ai_cache").delete().eq("key", key);
    return null;
  }

  return data.response_json;
}

export async function cacheResponse(
  key: string,
  prompt: string,
  response: any,
  ttl?: number
): Promise<void> {
  const supabase = createClient();
  await supabase.from("ai_cache").upsert({
    key,
    prompt,
    response_json: response,
    ttl: ttl || 7 * 24 * 60 * 60 * 1000,
  });
}

export async function generateIdeas(
  skills: string[],
  goal: string,
  weeks: number
): Promise<AIResponse> {
  const cacheKey = `ideas_${skills.join(",")}_${goal}_${weeks}`;
  const cached = await getCachedResponse(cacheKey);
  if (cached) {
    return { success: true, data: cached, cached: true };
  }

  const prompt = `You are a product coach. Student skills: ${skills.join(", ")}. Goal: ${goal}. Time: ${weeks} weeks. Suggest 3 recruiter-ready project ideas. For each: 1-line problem, 1-line solution, tech stack, 1 measurable outcome. Return as JSON array with fields: problem, solution, techStack (array), outcome.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No response from OpenAI");

    let data;
    try {
      data = JSON.parse(content);
    } catch {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Invalid JSON response from OpenAI");
      }
    }
    await cacheResponse(cacheKey, prompt, data);
    return { success: true, data };
  } catch (error: any) {
    console.error("OpenAI error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate ideas",
      data: [
        {
          problem: "Build a personal productivity dashboard",
          solution: "Create a web app to track tasks and goals",
          techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
          outcome: "Complete MVP in 4 weeks",
        },
      ],
    };
  }
}

export async function breakMilestones(
  projectTitle: string
): Promise<AIResponse> {
  const cacheKey = `milestones_${projectTitle}`;
  const cached = await getCachedResponse(cacheKey);
  if (cached) return { success: true, data: cached, cached: true };

  const prompt = `Break the project '${projectTitle}' into 5 milestones with deliverables and acceptance criteria; each milestone completable in 5–10 hours. Return as JSON array with fields: title, description, deliverables (array), acceptanceCriteria (array), estHours.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No response from OpenAI");

    let data;
    try {
      data = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Invalid JSON response from OpenAI");
      }
    }
    await cacheResponse(cacheKey, prompt, data);
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to break milestones",
      data: [],
    };
  }
}

export async function getMilestoneHelp(
  milestoneTitle: string,
  projectTitle: string
): Promise<AIResponse> {
  const cacheKey = `help_${projectTitle}_${milestoneTitle}`;
  const cached = await getCachedResponse(cacheKey);
  if (cached) return { success: true, data: cached, cached: true };

  const prompt = `For milestone '${milestoneTitle}' of project '${projectTitle}', give a 5-step implementation checklist and one short starter code snippet or CLI command. Return as JSON with fields: steps (array of strings), starterCode (string).`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No response from OpenAI");

    let data;
    try {
      data = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Invalid JSON response from OpenAI");
      }
    }
    await cacheResponse(cacheKey, prompt, data);
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to get milestone help",
      data: { steps: [], starterCode: "" },
    };
  }
}

export async function generatePortfolioBlurb(
  projectTitle: string
): Promise<AIResponse> {
  const cacheKey = `blurb_${projectTitle}`;
  const cached = await getCachedResponse(cacheKey);
  if (cached) return { success: true, data: cached, cached: true };

  const prompt = `Write a 120–150 word recruiter-friendly portfolio blurb for '${projectTitle}' describing problem, approach, tech stack, impact metric. Return as JSON with field: blurb (string).`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) throw new Error("No response from OpenAI");

    let data;
    try {
      data = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        data = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Invalid JSON response from OpenAI");
      }
    }
    await cacheResponse(cacheKey, prompt, data);
    return { success: true, data };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to generate blurb",
      data: { blurb: "" },
    };
  }
}

