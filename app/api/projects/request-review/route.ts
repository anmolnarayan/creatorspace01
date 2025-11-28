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

    const { projectId } = await request.json();

    // Verify ownership
    const { data: project } = await supabase
      .from("projects")
      .select("owner_id, status")
      .eq("id", projectId)
      .single();

    if (!project || project.owner_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update status to in_review
    const { error } = await supabase
      .from("projects")
      .update({ status: "in_review" })
      .eq("id", projectId);

    if (error) throw error;

    // Create a review record (assign to first available mentor)
    const { data: mentors } = await supabase
      .from("users")
      .select("id")
      .eq("role", "mentor")
      .limit(1);

    if (mentors && mentors.length > 0) {
      await supabase.from("reviews").insert({
        project_id: projectId,
        mentor_id: mentors[0].id,
        verified: false,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error requesting review:", error);
    return NextResponse.json(
      { error: error.message || "Failed to request review" },
      { status: 500 }
    );
  }
}

