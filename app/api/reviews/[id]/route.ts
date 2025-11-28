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

    // Verify mentor ownership
    const { data: review } = await supabase
      .from("reviews")
      .select("mentor_id")
      .eq("id", params.id)
      .single();

    if (!review || review.mentor_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { error } = await supabase
      .from("reviews")
      .update(body)
      .eq("id", params.id);

    if (error) throw error;

    // If verified, update project status
    if (body.verified) {
      const { data: reviewData } = await supabase
        .from("reviews")
        .select("project_id")
        .eq("id", params.id)
        .single();

      if (reviewData) {
        await supabase
          .from("projects")
          .update({ status: "verified" })
          .eq("id", reviewData.project_id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update review" },
      { status: 500 }
    );
  }
}

