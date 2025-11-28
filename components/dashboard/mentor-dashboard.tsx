import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ClipboardCheck, Clock } from "lucide-react";

export async function MentorDashboard({ userId }: { userId: string }) {
  const supabase = await createClient();

  // Get pending reviews
  const { data: pendingReviews } = await supabase
    .from("reviews")
    .select(
      `
      *,
      projects (
        id,
        title,
        short_summary,
        owner_id,
        status
      )
    `
    )
    .eq("mentor_id", userId)
    .eq("verified", false)
    .order("created_at", { ascending: true });

  // Get completed reviews count
  const { data: completedReviews } = await supabase
    .from("reviews")
    .select("id", { count: "exact" })
    .eq("mentor_id", userId)
    .eq("verified", true);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Mentor Dashboard</h1>
        <p className="text-gray-600">Review student projects and help them grow</p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviews?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedReviews?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Reviews */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Pending Reviews</h2>
        {pendingReviews && pendingReviews.length > 0 ? (
          <div className="space-y-4">
            {pendingReviews.map((review: any) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{review.projects?.title}</CardTitle>
                      <CardDescription>{review.projects?.short_summary}</CardDescription>
                    </div>
                    <span className="text-sm px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      Pending
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href={`/mentor/reviews/${review.id}`}>
                    <Button size="sm">Review Now</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No pending reviews. Check back later!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

