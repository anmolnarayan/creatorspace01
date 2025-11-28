import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: userProfile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userProfile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Run seed script
    try {
      const { stdout, stderr } = await execAsync("node scripts/seed.js");
      return NextResponse.json({ success: true, output: stdout });
    } catch (error: any) {
      console.error("Seed script error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to run seed script" },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error seeding:", error);
    return NextResponse.json(
      { error: error.message || "Failed to seed data" },
      { status: 500 }
    );
  }
}

