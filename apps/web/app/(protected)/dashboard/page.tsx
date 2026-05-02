import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getEvents } from "@repo/db";
import Link from "next/link";

import { SearchBar } from "@/components/SearchBar";

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ q?: string; filter?: string }> }) {
  const { q, filter } = await searchParams;
  let dbEvents: Awaited<ReturnType<typeof getEvents>> = [];
  let errorMsg: string | null = null;

  try {
    dbEvents = await getEvents();
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("Failed to fetch events:", err);
    errorMsg = err.message || JSON.stringify(err);
  }

  let validEvents = dbEvents;
  if (filter === 'completed') {
    validEvents = validEvents.filter(e => e.is_active === false);
  } else if (filter === 'all') {
    // Show everything
  } else {
    // Default to 'active'
    validEvents = validEvents.filter(e => e.is_active !== false);
  }

  if (q) {
    const query = q.toLowerCase();
    validEvents = validEvents.filter(e =>
      e.title.toLowerCase().includes(query) ||
      e.description.toLowerCase().includes(query)
    );
  }

  const events = validEvents.map(evt => ({
    id: evt.id,
    title: evt.title,
    description: evt.description,
    image_url: evt.image_url,
    dateStr: new Date(evt.date).toLocaleDateString('en-US', {
      month: 'short', day: '2-digit', year: 'numeric'
    }).toUpperCase(),
  }));

  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">

      {/* Header and Filter Section */}
      <section>
        <h1 className="text-3xl font-extrabold text-purple-900 mb-6">Explore Events</h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <SearchBar />

          <div className="flex items-center gap-2 bg-purple-50 p-1.5 rounded-xl border border-purple-100 shadow-sm">
            <Link href={`?filter=all${q ? `&q=${q}` : ''}`} scroll={false} className={`rounded-lg px-6 h-10 font-bold flex items-center justify-center transition-colors ${filter === 'all' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-600 hover:text-purple-900 hover:bg-purple-100/50'}`}>
              All
            </Link>
            <Link href={`?filter=active${q ? `&q=${q}` : ''}`} scroll={false} className={`rounded-lg px-6 h-10 font-bold flex items-center justify-center transition-colors ${(!filter || filter === 'active') ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-600 hover:text-purple-900 hover:bg-purple-100/50'}`}>
              Active
            </Link>
            <Link href={`?filter=completed${q ? `&q=${q}` : ''}`} scroll={false} className={`rounded-lg px-6 h-10 font-bold flex items-center justify-center transition-colors ${filter === 'completed' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-600 hover:text-purple-900 hover:bg-purple-100/50'}`}>
              Completed
            </Link>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section>
        <h2 className="text-xl font-bold text-purple-800 mb-6 tracking-tight">Upcoming Events</h2>

        {errorMsg ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-200">
            <h3 className="font-bold">Error loading events</h3>
            <p className="text-sm mt-2">{errorMsg}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((evt) => (
              <Card key={evt.id} className="border-purple-100 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-300 overflow-hidden flex flex-col rounded-2xl group bg-white h-[400px]">
                {/* Image Placeholder */}
                <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-purple-50 relative overflow-hidden group-hover:from-purple-200 group-hover:to-purple-100 transition-colors">
                  {evt.image_url ? (
                    <img src={evt.image_url} alt={evt.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-purple-200/20 mix-blend-overlay"></div>
                  )}
                </div>

                <CardHeader className="pb-3 flex-1 px-6 pt-6">
                  <CardTitle className="text-sm font-extrabold text-purple-950 tracking-wide uppercase mb-2 truncate">
                    {evt.title}
                  </CardTitle>
                  <CardDescription className="text-purple-600 font-medium text-sm leading-relaxed line-clamp-2">
                    {evt.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pb-2">
                  <p className="text-xs font-bold text-purple-500 uppercase">
                    {evt.dateStr}
                  </p>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-2 flex justify-end">
                  <Link href={`/events/${evt.id}`}>
                    <Button className="font-bold text-xs uppercase tracking-wider px-6 bg-purple-600 hover:bg-purple-700 text-purple-50 shadow hover:shadow-md transition-all rounded-lg">
                      Details / Apply
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
