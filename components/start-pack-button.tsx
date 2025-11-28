"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function StartPackButton({
  launchPackId,
  userId,
}: {
  launchPackId: string;
  userId: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ launchPackId, userId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to start project");

      toast({
        title: "Project started!",
        description: "Redirecting to your project workspace...",
      });

      router.push(`/projects/${data.projectId}`);
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button size="lg" onClick={handleStart} disabled={loading}>
      {loading ? "Starting..." : "Start Launch Pack"}
    </Button>
  );
}

