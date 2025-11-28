"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AIHelpModal({
  milestoneTitle,
  projectTitle,
}: {
  milestoneTitle: string;
  projectTitle: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [help, setHelp] = useState<any>(null);
  const { toast } = useToast();

  const fetchHelp = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/help", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ milestoneTitle, projectTitle }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to get AI help");

      setHelp(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to get AI help",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={fetchHelp} disabled={loading}>
          <Sparkles className="h-4 w-4 mr-2" />
          Get AI Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Help: {milestoneTitle}</DialogTitle>
          <DialogDescription>
            Get step-by-step guidance for this milestone
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center">Loading AI help...</div>
        ) : help ? (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Implementation Checklist</h3>
              <ol className="list-decimal list-inside space-y-2">
                {help.steps?.map((step: string, i: number) => (
                  <li key={i} className="text-gray-700">
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            {help.starterCode && (
              <div>
                <h3 className="font-semibold mb-2">Starter Code</h3>
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{help.starterCode}</code>
                </pre>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            Click &quot;Get AI Help&quot; to load guidance
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

