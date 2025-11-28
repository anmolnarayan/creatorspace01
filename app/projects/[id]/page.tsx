import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/navbar";
import { ProjectWorkspace } from "@/components/project-workspace";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!project || project.owner_id !== user.id) {
    redirect("/projects");
  }

  const { data: projectMilestones } = await supabase
    .from("project_milestones")
    .select(
      `
      *,
      milestones (
        id,
        title,
        description,
        order_index,
        est_hours
      )
    `
    )
    .eq("project_id", params.id)
    .order("milestones(order_index)", { ascending: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ProjectWorkspace project={project} milestones={projectMilestones || []} />
    </div>
  );
}

