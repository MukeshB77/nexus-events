import { Button } from "@repo/ui";
import { ArrowRight, CalendarDays, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white selection:bg-purple-200">
    
      <div className="pointer-events-none absolute inset-0 flex justify-center">
        <div className="absolute -top-[20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-purple-200/50 blur-[100px]" />
        <div className="absolute right-[-5%] top-[20%] h-[400px] w-[400px] rounded-full bg-blue-100/50 blur-[100px]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-8 py-6 md:px-12 lg:px-24">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-lg shadow-purple-200">
              <CalendarDays className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Nexus
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" className="text-slate-600 hover:text-purple-600" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          </nav>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
          <div className="max-w-4xl space-y-8 mt-24">
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-7xl">
              The easiest way to <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                manage club events.
              </span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              Ditch the messy spreadsheets and confusing group chats. Discover what&apos;s happening on campus, RSVP with a tap, and keep track of everything in one place.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              <Button size="lg" className="h-14 rounded-full bg-purple-600 px-8 text-base shadow-lg shadow-purple-200 transition-all hover:scale-105 hover:bg-purple-700" asChild>
                <Link href="/dashboard">
                  Explore Events <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="h-14 rounded-full border-slate-200 px-8 text-base transition-all hover:bg-slate-50" asChild>
                <Link href="/login">
                  Club Login
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-24 grid w-full max-w-5xl grid-cols-1 gap-8 px-4 sm:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold text-slate-900">Instant RSVPs</h3>
              <p className="text-sm text-slate-500">Book your spot at the best events before they fill up.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold text-slate-900">Find Your People</h3>
              <p className="text-sm text-slate-500">Connect with members who share your passions.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-100 text-pink-600">
                <CalendarDays className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-semibold text-slate-900">Smart Calendar</h3>
              <p className="text-sm text-slate-500">Never miss a meeting with automatic schedule sync.</p>
            </div>
          </div>
        </main>
        
        <footer className="mt-auto py-8 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Nexus Club Manager. Built by actual humans.</p>
        </footer>
      </div>
    </div>
  );
}
