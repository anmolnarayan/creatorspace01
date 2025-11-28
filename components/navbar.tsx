"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/components/providers";

export function Navbar() {
  const { user } = useUser();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/dashboard" className="text-2xl font-bold text-primary">
          CreatorSpace
        </Link>
        <div className="flex gap-4 items-center">
          {user && (
            <>
              <Link href="/launch-packs">
                <Button variant="ghost">Launch Packs</Button>
              </Link>
              <Link href="/projects">
                <Button variant="ghost">My Projects</Button>
              </Link>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

