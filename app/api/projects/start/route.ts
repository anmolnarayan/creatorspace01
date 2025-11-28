import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { launchPackId, userId } = await request.json();

    if (userId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Get launch pack details
    const { data: launchPack } = await supabase
      .from("launch_packs")
      .select("*")
      .eq("id", launchPackId)
      .single();

    if (!launchPack) {
      return NextResponse.json({ error: "Launch pack not found" }, { status: 404 });
    }

    // Get milestones
    const { data: milestones } = await supabase
      .from("milestones")
      .select("*")
      .eq("launch_pack_id", launchPackId)
      .order("order_index", { ascending: true });

    // Create project
    const projectTitle = `${launchPack.title} - ${user.email?.split("@")[0]}`;
    const publicSlug = generateSlug(projectTitle) + "-" + Date.now().toString(36);

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        owner_id: userId,
        launch_pack_id: launchPackId,
        title: projectTitle,
        short_summary: `Building ${launchPack.title}`,
        status: "in_progress",
        progress_percent: 0,
        started_at: new Date().toISOString(),
        public_slug: publicSlug,
      })
      .select()
      .single();

    if (projectError) throw projectError;

    // Create project milestones
    if (milestones && milestones.length > 0) {
      const projectMilestones = milestones.map((milestone) => ({
        project_id: project.id,
        milestone_id: milestone.id,
        completed: false,
      }));

      const { error: pmError } = await supabase
        .from("project_milestones")
        .insert(projectMilestones);

      if (pmError) throw pmError;
    }

    return NextResponse.json({ projectId: project.id });
  } catch (error: any) {
    console.error("Error starting project:", error);
    return NextResponse.json(
      { error: error.message || "Failed to start project" },
      { status: 500 }
    );
  }
}

