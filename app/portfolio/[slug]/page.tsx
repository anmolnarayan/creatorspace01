import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, ExternalLink, Github } from "lucide-react";
import { notFound } from "next/navigation";

export default async function PortfolioPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("public_slug", params.slug)
    .single();

  if (!project) {
    notFound();
  }

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("*")
    .eq("project_id", project.id)
    .eq("verified_badge", true)
    .single();

  if (!portfolio) {
    notFound();
  }

  const { data: owner } = await supabase
    .from("users")
    .select("name, college")
    .eq("id", project.owner_id)
    .single();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="mb-8">
          {portfolio.verified_badge && (
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-700">Verified Project</span>
            </div>
          )}
          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{project.short_summary}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Reliability Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {portfolio.reliability_score_snapshot?.toFixed(1) || "0.0"}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-100 text-green-800">Verified</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm">{owner?.name || "Anonymous"}</div>
              {owner?.college && (
                <div className="text-xs text-gray-500">{owner.college}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {project.tech_stack && project.tech_stack.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Tech Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech: string) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {portfolio.mentor_comment && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Mentor Review</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{portfolio.mentor_comment}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-4">
          {project.repo_url && (
            <a
              href={project.repo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              <Github className="h-5 w-5" />
              View on GitHub
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              <ExternalLink className="h-5 w-5" />
              View Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

