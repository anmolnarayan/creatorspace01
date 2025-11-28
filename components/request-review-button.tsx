"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function RequestReviewButton({ projectId }: { projectId: string }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleRequest = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects/request-review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to request review");

      toast({
        title: "Review requested!",
        description: "A mentor will review your project soon.",
      });

      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to request review",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleRequest} disabled={loading} className="w-full">
      {loading ? "Requesting..." : "Request Mentor Review"}
    </Button>
  );
}

