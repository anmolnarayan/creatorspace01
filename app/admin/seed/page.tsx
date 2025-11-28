"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function AdminSeedPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seed", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to seed data");

      toast({
        title: "Success!",
        description: "Seed data created successfully.",
      });

      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to seed data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Seed Data</CardTitle>
          <CardDescription>
            This will create sample launch packs, milestones, and other demo data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSeed} disabled={loading} className="w-full">
            {loading ? "Seeding..." : "Run Seed Script"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

