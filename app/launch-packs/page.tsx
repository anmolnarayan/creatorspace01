import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function LaunchPacksPage() {
  const supabase = await createClient();
  const { data: launchPacks } = await supabase
    .from("launch_packs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Launch Packs</h1>
        <p className="text-gray-600 mb-8">
          Choose a structured project template to build your portfolio
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {launchPacks?.map((pack) => (
            <Card key={pack.id}>
              <CardHeader>
                <CardTitle>{pack.title}</CardTitle>
                <CardDescription>{pack.short_description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2 flex-wrap">
                    {pack.tags?.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>Duration: {pack.duration_weeks} weeks</div>
                    <div>Difficulty: {pack.difficulty}</div>
                  </div>
                  <Link href={`/launch-packs/${pack.slug}`}>
                    <Button className="w-full">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

