"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AIHelpModal } from "@/components/ai-help-modal";
import { RequestReviewButton } from "@/components/request-review-button";
import { CheckCircle2, Circle } from "lucide-react";

interface ProjectWorkspaceProps {
  project: any;
  milestones: any[];
}

export function ProjectWorkspace({ project, milestones }: ProjectWorkspaceProps) {
  const [selectedMilestone, setSelectedMilestone] = useState<any>(null);
  const [milestoneStates, setMilestoneStates] = useState<Record<string, boolean>>(
    milestones.reduce((acc, pm) => {
      acc[pm.id] = pm.completed;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const handleToggleMilestone = async (pmId: string, completed: boolean) => {
    try {
      const res = await fetch(`/api/projects/milestones/${pmId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });

      if (!res.ok) throw new Error("Failed to update milestone");

      setMilestoneStates((prev) => ({ ...prev, [pmId]: completed }));

      // Recalculate progress
      const completedCount = Object.values({
        ...milestoneStates,
        [pmId]: completed,
      }).filter(Boolean).length;
      const newProgress = Math.round((completedCount / milestones.length) * 100);

      // Update project progress
      await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress_percent: newProgress }),
      });
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  };

  const completedCount = Object.values(milestoneStates).filter(Boolean).length;
  const progress = Math.round((completedCount / milestones.length) * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <p className="text-gray-600">{project.short_summary}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Milestone Checklist */}
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Milestones</CardTitle>
                <CardDescription>
                  {completedCount} of {milestones.length} completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestones.map((pm: any) => {
                    const milestone = pm.milestones;
                    const isCompleted = milestoneStates[pm.id];

                    return (
                      <div
                        key={pm.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedMilestone?.id === pm.id
                            ? "border-primary bg-blue-50"
                            : "border-gray-200"
                        }`}
                        onClick={() => setSelectedMilestone(pm)}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleMilestone(pm.id, !isCompleted);
                            }}
                            className="mt-1"
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                          <div className="flex-1">
                            <h3 className="font-semibold">{milestone.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {milestone.description}
                            </p>
                            <div className="text-xs text-gray-500 mt-2">
                              Est. {milestone.est_hours} hours
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected Milestone Detail */}
            {selectedMilestone && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedMilestone.milestones.title}</CardTitle>
                  <CardDescription>
                    {selectedMilestone.milestones.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Notes</h4>
                      <textarea
                        className="w-full p-3 border rounded-lg"
                        rows={4}
                        placeholder="Add your notes here..."
                        defaultValue={selectedMilestone.notes || ""}
                        onChange={async (e) => {
                          await fetch(`/api/projects/milestones/${selectedMilestone.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ notes: e.target.value }),
                          });
                        }}
                      />
                    </div>
                    <AIHelpModal
                      milestoneTitle={selectedMilestone.milestones.title}
                      projectTitle={project.title}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Project Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Project Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Progress</div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{progress}% complete</div>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Status</div>
                  <div className="text-sm text-gray-600">{project.status}</div>
                </div>

                {project.repo_url && (
                  <div>
                    <div className="text-sm font-medium mb-2">Repository</div>
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View on GitHub
                    </a>
                  </div>
                )}

                {project.status === "in_progress" && (
                  <RequestReviewButton projectId={project.id} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

