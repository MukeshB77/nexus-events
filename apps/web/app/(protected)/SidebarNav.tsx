"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, LayoutDashboard, Settings } from "lucide-react";

export function SidebarNav({ userRole, isGuest }: { userRole: string; isGuest: boolean }) {
  const pathname = usePathname();

  const getLinkClasses = (href: string, activeSuffixes?: string[]) => {
    let isActive = pathname === href;
    if (activeSuffixes && !isActive) {
      isActive = activeSuffixes.some(s => pathname.startsWith(s));
    }

    if (isActive) {
      return "flex items-center gap-3 px-3 py-2 text-sm font-semibold rounded-lg bg-purple-100 text-purple-700 shadow-sm transition-all";
    }
    return "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-purple-600 hover:text-purple-800 hover:bg-purple-50 transition-all";
  };

  if (userRole.toLowerCase() === 'admin') {
    return (
      <nav className="flex-1 px-4 space-y-2 flex flex-col pt-2">
        <Link href="/admin/dashboard" className={getLinkClasses("/admin/dashboard")}>
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </Link>
        <Link href="/admin/events" className={getLinkClasses("/admin/events", ["/admin/events"])}>
          <Calendar className="w-5 h-5" />
          Manage Events
        </Link>
        <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-purple-600/50 cursor-not-allowed transition-all mt-auto" title="Coming soon">
          <Settings className="w-5 h-5" />
          Manage Members (WIP)
        </div>
      </nav>
    );
  }

  return (
    <nav className="flex-1 px-4 space-y-2 flex flex-col pt-2">
      <Link href="/dashboard" className={getLinkClasses("/dashboard")}>
        <Calendar className="w-5 h-5" />
        Events
      </Link>
      <Link href="/dashboard/my-events" className={getLinkClasses("/dashboard/my-events", ["/dashboard/my"])}>
        <LayoutDashboard className="w-5 h-5" />
        My RSVP Events
      </Link>
      {!isGuest && (
        <Link href="/dashboard/settings" className={getLinkClasses("/dashboard/settings")}>
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      )}
    </nav>
  );
}
