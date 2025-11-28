import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function MentorReviewsPage() {
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

  if (userProfile?.role !== "mentor" && userProfile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: reviews } = await supabase
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
    .eq("mentor_id", user.id)
    .order("created_at", { ascending: false });

  const pendingReviews = reviews?.filter((r: any) => !r.verified) || [];
  const completedReviews = reviews?.filter((r: any) => r.verified) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mentor Reviews</h1>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Pending Reviews</h2>
          {pendingReviews.length > 0 ? (
            <div className="space-y-4">
              {pendingReviews.map((review: any) => (
                <Card key={review.id}>
                  <CardHeader>
                    <CardTitle>{review.projects?.title}</CardTitle>
                    <CardDescription>{review.projects?.short_summary}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={`/mentor/reviews/${review.id}`}>
                      <Button>Review Now</Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No pending reviews
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Completed Reviews</h2>
          {completedReviews.length > 0 ? (
            <div className="space-y-4">
              {completedReviews.map((review: any) => (
                <Card key={review.id}>
                  <CardHeader>
                    <CardTitle>{review.projects?.title}</CardTitle>
                    <CardDescription>
                      Rating: {review.rating}/5 • {review.verified ? "Verified" : "Not Verified"}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No completed reviews yet
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

