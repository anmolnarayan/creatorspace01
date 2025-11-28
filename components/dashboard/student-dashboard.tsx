import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Rocket, TrendingUp, Award } from "lucide-react";

export async function StudentDashboard({ userId }: { userId: string }) {
  const supabase = await createClient();

  // Get recommended launch packs
  const { data: userProfile } = await supabase
    .from("users")
    .select("skills, goal")
    .eq("id", userId)
    .single();

  const { data: launchPacks } = await supabase
    .from("launch_packs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(6);

  // Get user's projects
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  const activeProjects = projects?.filter((p) => p.status === "in_progress") || [];
  const completedProjects = projects?.filter((p) => p.status === "verified") || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-gray-600">Continue building your portfolio</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Rocket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Reliability Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProfile?.reliability_score?.toFixed(1) || "0.0"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommended Launch Packs */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recommended Launch Packs</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {launchPacks?.map((pack) => (
            <Card key={pack.id}>
              <CardHeader>
                <CardTitle>{pack.title}</CardTitle>
                <CardDescription>{pack.short_description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {pack.duration_weeks} weeks • {pack.difficulty}
                  </span>
                  <Link href={`/launch-packs/${pack.slug}`}>
                    <Button size="sm">View</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      {projects && projects.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Projects</h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription>{project.short_summary}</CardDescription>
                    </div>
                    <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {project.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Progress: {project.progress_percent}%
                    </div>
                    <Link href={`/projects/${project.id}`}>
                      <Button size="sm">Open</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

