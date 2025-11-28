import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StartPackButton } from "@/components/start-pack-button";
import { CheckCircle } from "lucide-react";

export default async function LaunchPackDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: launchPack } = await supabase
    .from("launch_packs")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!launchPack) {
    redirect("/launch-packs");
  }

  const { data: milestones } = await supabase
    .from("milestones")
    .select("*")
    .eq("launch_pack_id", launchPack.id)
    .order("order_index", { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{launchPack.title}</h1>
          <p className="text-xl text-gray-600 mb-8">{launchPack.short_description}</p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-medium">Duration:</span> {launchPack.duration_weeks}{" "}
                  weeks
                </div>
                <div>
                  <span className="font-medium">Difficulty:</span> {launchPack.difficulty}
                </div>
                <div>
                  <span className="font-medium">Tags:</span>{" "}
                  {launchPack.tags?.join(", ") || "None"}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What You'll Build</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  This launch pack will guide you through building a complete, recruiter-ready
                  project with verified milestones and mentor reviews.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Milestones</h2>
            <div className="space-y-4">
              {milestones?.map((milestone, index) => (
                <Card key={milestone.id}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <CardTitle>{milestone.title}</CardTitle>
                        <CardDescription className="mt-2">
                          {milestone.description}
                        </CardDescription>
                        <div className="mt-2 text-sm text-gray-600">
                          Estimated: {milestone.est_hours} hours
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {user && (
            <div className="text-center">
              <StartPackButton launchPackId={launchPack.id} userId={user.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

