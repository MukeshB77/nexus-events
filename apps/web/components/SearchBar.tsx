"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="relative w-full max-w-sm">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400">
        <Search className={`w-5 h-5 ${isPending ? 'animate-pulse' : ''}`} />
      </div>
      <Input 
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get('q')?.toString() || ''}
        placeholder="Search programs..." 
        className="pl-10 h-12 rounded-xl border-purple-200 bg-white placeholder:text-purple-300 focus-visible:ring-purple-400 focus-visible:border-purple-400 text-purple-900 shadow-sm transition-all"
      />
    </div>
  );
}
