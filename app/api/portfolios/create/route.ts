import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { projectId, reviewId } = await request.json();

    // Get project and review
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    const { data: review } = await supabase
      .from("reviews")
      .select("*, users!reviews_mentor_id_fkey(reliability_score)")
      .eq("id", reviewId)
      .single();

    if (!project || !review) {
      return NextResponse.json(
        { error: "Project or review not found" },
        { status: 404 }
      );
    }

    // Get owner's reliability score
    const { data: owner } = await supabase
      .from("users")
      .select("reliability_score")
      .eq("id", project.owner_id)
      .single();

    const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portfolio/${project.public_slug}`;

    const { data: portfolio, error } = await supabase
      .from("portfolios")
      .insert({
        project_id: projectId,
        public_url: publicUrl,
        mentor_comment: review.comments,
        verified_badge: true,
        reliability_score_snapshot: owner?.reliability_score || 0,
      })
      .select()
      .single();

    if (error) throw error;

    // Update project to published
    await supabase
      .from("projects")
      .update({ status: "published" })
      .eq("id", projectId);

    return NextResponse.json({ portfolio });
  } catch (error: any) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create portfolio" },
      { status: 500 }
    );
  }
}

