import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminLaunchPacksPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userProfile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userProfile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: launchPacks } = await supabase
    .from("launch_packs")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Launch Packs</h1>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {launchPacks?.map((pack) => (
            <Card key={pack.id}>
              <CardHeader>
                <CardTitle>{pack.title}</CardTitle>
                <CardDescription>{pack.short_description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 mb-4">
                  <div>Slug: {pack.slug}</div>
                  <div>Duration: {pack.duration_weeks} weeks</div>
                  <div>Difficulty: {pack.difficulty}</div>
                </div>
                <Button variant="outline" className="w-full">
                  Edit
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

