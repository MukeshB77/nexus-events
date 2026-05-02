import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";
import { createClient } from "@/lib/supabase/server";
import { SidebarNav } from "./SidebarNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const isGuest = !user;
  let userName = user?.user_metadata?.username || user?.user_metadata?.full_name || user?.email || "Guest";
  if (userName.includes('@')) {
    userName = userName.split('@')[0];
  }
  const userRole = user?.user_metadata?.role || "Member";
  const userInitials = userName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-[#faf5ff] text-purple-950 font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-purple-100 bg-white flex flex-col hidden md:flex shadow-sm">
        <div className="p-6">
          <Link href="/">
            <h2 className="text-2xl font-extrabold tracking-tight text-purple-900 cursor-pointer">
              Nexus
            </h2>
          </Link>
        </div>
        <SidebarNav userRole={userRole} isGuest={isGuest} />
        <div className="p-4 border-t border-purple-100 bg-purple-50/50">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-200 flex justify-center items-center text-purple-700 font-bold border border-purple-300">
                {userInitials}
              </div>
              <div className="text-sm max-w-[100px]">
                <p className="font-bold text-purple-900 truncate" title={userName}>{userName}</p>
                <p className="text-xs font-semibold text-purple-600 capitalize truncate">{isGuest ? "Guest" : userRole}</p>
              </div>
            </div>
            {isGuest ? (
               <Link href="/login" className="text-purple-600 hover:text-purple-900 text-xs font-bold border border-purple-200 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-all shrink-0">
                 Login
               </Link>
            ) : (
               <LogoutButton />
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="md:hidden flex h-16 items-center justify-between border-b border-purple-100 px-6 bg-white shadow-sm">
          <h2 className="text-xl font-extrabold text-purple-900">Nexus</h2>
          <LogoutButton />
        </header>

        <div className="flex-1 p-6 md:p-10 overflow-y-auto">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
