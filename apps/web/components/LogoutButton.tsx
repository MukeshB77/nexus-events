"use client";

import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    
    // Once signed out, redirect back to the home or login page
    router.push("/login");
    router.refresh();
  }

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className="text-purple-400 hover:text-purple-700 p-2 rounded-xl hover:bg-purple-100 transition-colors flex items-center justify-center shrink-0 disabled:opacity-50"
      title="Log out"
    >
      <LogOut className="w-4 h-4" />
    </button>
  );
}
