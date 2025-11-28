"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export function ReviewForm({ review }: { review: any }) {
  const [formData, setFormData] = useState({
    meets_brief: review.meets_brief || false,
    core_functional: review.core_functional || false,
    docs_ok: review.docs_ok || false,
    demo_ok: review.demo_ok || false,
    rating: review.rating || 3,
    comments: review.comments || "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const project = review.projects;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate verification: 3 of 4 booleans true AND rating >= 3
      const trueCount = [
        formData.meets_brief,
        formData.core_functional,
        formData.docs_ok,
        formData.demo_ok,
      ].filter(Boolean).length;
      const verified = trueCount >= 3 && formData.rating >= 3;

      const res = await fetch(`/api/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          verified,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to submit review");

      toast({
        title: "Review submitted!",
        description: verified
          ? "Project verified and portfolio created."
          : "Review saved.",
      });

      // If verified, create portfolio
      if (verified) {
        await fetch("/api/portfolios/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: project.id,
            reviewId: review.id,
          }),
        });
      }

      router.push("/mentor/reviews");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Review Project</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{project.title}</CardTitle>
          <CardDescription>{project.short_summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {project.repo_url && (
              <div>
                <span className="font-medium">Repository: </span>
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {project.repo_url}
                </a>
              </div>
            )}
            {project.demo_url && (
              <div>
                <span className="font-medium">Demo: </span>
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {project.demo_url}
                </a>
              </div>
            )}
            {project.tech_stack && project.tech_stack.length > 0 && (
              <div>
                <span className="font-medium">Tech Stack: </span>
                {project.tech_stack.join(", ")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Review Checklist</CardTitle>
            <CardDescription>
              Check all that apply. Project will be verified if 3+ checks and rating ≥ 3
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="meets_brief"
                  checked={formData.meets_brief}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, meets_brief: checked as boolean })
                  }
                />
                <Label htmlFor="meets_brief" className="cursor-pointer">
                  Meets the project brief
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="core_functional"
                  checked={formData.core_functional}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, core_functional: checked as boolean })
                  }
                />
                <Label htmlFor="core_functional" className="cursor-pointer">
                  Core functionality works
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="docs_ok"
                  checked={formData.docs_ok}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, docs_ok: checked as boolean })
                  }
                />
                <Label htmlFor="docs_ok" className="cursor-pointer">
                  Documentation is adequate
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="demo_ok"
                  checked={formData.demo_ok}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, demo_ok: checked as boolean })
                  }
                />
                <Label htmlFor="demo_ok" className="cursor-pointer">
                  Demo is accessible and working
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5)</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: parseInt(e.target.value) })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Micro-review (1-2 lines)</Label>
              <textarea
                id="comments"
                className="w-full p-3 border rounded-lg"
                rows={3}
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                placeholder="Brief feedback for the student..."
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

