import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Verify project ownership
    const { data: pm } = await supabase
      .from("project_milestones")
      .select("project_id, projects!inner(owner_id)")
      .eq("id", params.id)
      .single();

    if (!pm || (pm as any).projects.owner_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const updateData: any = {};
    if (body.completed !== undefined) {
      updateData.completed = body.completed;
      if (body.completed) {
        updateData.completed_at = new Date().toISOString();
      }
    }
    if (body.notes !== undefined) {
      updateData.notes = body.notes;
    }

    const { error } = await supabase
      .from("project_milestones")
      .update(updateData)
      .eq("id", params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating milestone:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update milestone" },
      { status: 500 }
    );
  }
}

