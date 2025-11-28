import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { MentorDashboard } from "@/components/dashboard/mentor-dashboard";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!userProfile) {
    redirect("/signup");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {userProfile.role === "student" && <StudentDashboard userId={user.id} />}
        {userProfile.role === "mentor" && <MentorDashboard userId={user.id} />}
        {userProfile.role === "admin" && <AdminDashboard />}
      </div>
    </div>
  );
}

