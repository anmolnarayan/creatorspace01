import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { ReviewForm } from "@/components/review-form";

export default async function ReviewDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: review } = await supabase
    .from("reviews")
    .select(
      `
      *,
      projects (
        id,
        title,
        short_summary,
        tech_stack,
        repo_url,
        demo_url,
        owner_id,
        status
      )
    `
    )
    .eq("id", params.id)
    .single();

  if (!review || (review as any).mentor_id !== user.id) {
    redirect("/mentor/reviews");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <ReviewForm review={review} />
      </div>
    </div>
  );
}

