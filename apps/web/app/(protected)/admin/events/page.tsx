import { getEvents } from "@repo/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminEventsPage() {
  let events: any[] = []; // keeping any to avoid complex TS types for now
  let errorMsg = null;
  try {
    events = await getEvents();
  } catch (error: unknown) {
    console.error("Failed to fetch admin events:", error);
    errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
  }

  return (
    <div className="space-y-8 p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-purple-900">Manage Events</h1>
          <p className="text-purple-600 mt-2">View and manage all platform events.</p>
        </div>
        <Link href="/events/create">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
            Create New Event
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
        {errorMsg ? (
          <div className="bg-red-50 text-red-600 p-6">
            <h3 className="font-bold">Error loading events</h3>
            <p className="text-sm mt-2">{errorMsg}</p>
          </div>
        ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-purple-50 border-b border-purple-100">
              <th className="p-4 font-semibold text-purple-800">Event Name</th>
              <th className="p-4 font-semibold text-purple-800">Date</th>
              <th className="p-4 font-semibold text-purple-800">Location</th>
              <th className="p-4 font-semibold text-purple-800 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-purple-500">
                  No events found. Create one.
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.id} className="border-b border-purple-50 hover:bg-purple-50/50 transition-colors">
                  <td className="p-4 font-medium text-purple-900">{event.title}</td>
                  <td className="p-4 text-purple-600">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </td>
                  <td className="p-4 text-purple-600">{event.location}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/events/${event.id}`}>
                        <Button variant="outline" size="sm" className="border-purple-200 text-purple-700 hover:bg-purple-100">
                          Details
                        </Button>
                      </Link>
                      <form action={async () => {
                        "use server";
                        const { deleteEvent } = await import("@repo/db");
                        const { revalidatePath } = await import("next/cache");
                        await deleteEvent(event.id);
                        revalidatePath("/admin/events");
                        revalidatePath("/dashboard");
                      }}>
                        <Button variant="outline" size="sm" type="submit" className="border-red-200 text-red-600 hover:bg-red-50">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}
