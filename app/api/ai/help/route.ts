import { NextRequest, NextResponse } from "next/server";
import { getMilestoneHelp } from "@/lib/openai";

export async function POST(request: NextRequest) {
  try {
    const { milestoneTitle, projectTitle } = await request.json();

    if (!milestoneTitle || !projectTitle) {
      return NextResponse.json(
        { error: "milestoneTitle and projectTitle are required" },
        { status: 400 }
      );
    }

    const result = await getMilestoneHelp(milestoneTitle, projectTitle);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error("Error getting AI help:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get AI help" },
      { status: 500 }
    );
  }
}

