import { getUserRSVPs } from "@repo/db";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { StatusSelector } from "./StatusSelector";

type RSVP = Awaited<ReturnType<typeof getUserRSVPs>>[number];

export default async function MyEventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please login first.</div>;
  }

  let rsvps: RSVP[] = [];
  try {
    rsvps = await getUserRSVPs(user.id);
  } catch (err: unknown) {
    console.error(err);
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-purple-900 mb-2">My Events</h1>
        <p className="text-purple-600 font-medium">Manage your event applications and RSVP statuses.</p>
      </div>

      {rsvps.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-purple-100 shadow-sm">
          <p className="text-purple-500 font-bold text-lg mb-4">You haven&apos;t applied to any events yet.</p>
          <Link href="/dashboard" className="inline-flex bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold shadow-md transition-all">
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {rsvps.map((rsvp) => {
            const evt = rsvp.events;
            if (!evt) return null;

            return (
              <Card key={rsvp.id} className="border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col rounded-2xl bg-white">
                <CardHeader className="pb-3 border-b border-purple-50">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <CardTitle className="text-lg font-extrabold text-purple-950 truncate mb-1">
                        {evt.title}
                      </CardTitle>
                      <CardDescription className="text-purple-600 text-xs font-semibold uppercase">
                        {new Date(evt.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </CardDescription>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-lg border ${rsvp.status === 'attending' ? 'bg-green-50 text-green-700 border-green-200' :
                        rsvp.status === 'maybe' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                          'bg-red-50 text-red-700 border-red-200'
                      }`}>
                      {rsvp.status}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-6 flex-1 bg-purple-50/30">
                  <p className="text-sm text-purple-800 font-medium whitespace-pre-wrap line-clamp-3">
                    {evt.description}
                  </p>
                </CardContent>

                <CardFooter className="p-6 bg-white flex flex-col gap-3 rounded-b-2xl border-t border-purple-50">
                  <div className="w-full">
                    <p className="text-xs font-bold text-purple-500 mb-2 uppercase">Change Status</p>
                    <StatusSelector eventId={evt.id} currentStatus={rsvp.status} />
                  </div>
                  <Link href={`/events/${evt.id}`} className="w-full">
                    <button className="w-full py-2 bg-purple-100 text-purple-700 font-bold rounded-lg text-sm hover:bg-purple-200 transition-colors">
                      View Event Details
                    </button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
