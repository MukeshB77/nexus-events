import { ReactNode } from "react";
import Link from "next/link";
import { CalendarDays, Sparkles } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#faf5ff] text-purple-950 font-sans">
      {/* Left Pane - Illustration/Brand */}
      <div className="hidden lg:flex lg:w-1/2 p-6">
        <div className="flex flex-col flex-1 bg-white rounded-[2.5rem] border border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          
          {/* Top Left Logo Placeholder */}
          <div className="absolute top-10 left-10 flex items-center gap-3 z-10 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-200">
              <CalendarDays className="h-6 w-6" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight hidden md:block text-purple-950">Nexus</span>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center relative z-0 p-16">
            {/* Soft decorative background circles */}
            <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-purple-100/50 rounded-full blur-[80px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[25rem] h-[25rem] bg-violet-100/60 rounded-full blur-[80px]" />
            
            <div className="relative w-full max-w-[28rem] aspect-[4/3] bg-purple-50/50 rounded-[2.5rem] border-2 border-dashed border-purple-200/60 flex flex-col items-center justify-center p-10 text-center backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-purple-400 group">
                <div className="w-24 h-24 rounded-3xl bg-purple-100/80 text-purple-600 mb-8 flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-200 transition-all duration-500 shadow-sm">
                  <Sparkles className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold text-purple-900 mb-3 tracking-tight">Discover Events</h3>
                <p className="text-purple-600/90 text-md leading-relaxed font-medium">Join thousands of events, RSVP instantly, and stay connected.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex-1 flex flex-col justify-center py-16 px-6 sm:px-12 lg:flex-none lg:w-1/2 lg:px-24 xl:px-32 relative">
        <div className="mx-auto w-full max-w-md lg:w-full lg:max-w-sm xl:max-w-md relative z-10">
           {children}
        </div>
      </div>
    </div>
  );
}
