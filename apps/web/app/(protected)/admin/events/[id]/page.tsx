import { getEventById, getEventRSVPs, deleteRSVP } from "@repo/db";
import { revalidatePath } from "next/cache";

export default async function AdminEventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await getEventById(id);
  const rsvps = await getEventRSVPs(id);

  if (!event) {
    return <div className="p-8 text-red-500">Event not found.</div>;
  }

  async function handleRemoveRsvp(formData: FormData) {
    "use server";
    const rsvpId = formData.get("rsvpId") as string;
    if (rsvpId) {
      await deleteRSVP(rsvpId);
      revalidatePath(`/admin/events/${id}`);
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      {/* Back Button */}
      <div>
        <a href="/admin/events" className="inline-flex items-center text-purple-600 hover:text-purple-800 hover:bg-purple-50 px-3 py-2 rounded-lg font-semibold transition-all -ml-3">
          ← Back to Admin Events
        </a>
      </div>

      {/* Event Header */}
      <div className="bg-purple-900 text-white p-8 rounded-2xl shadow-lg relative flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">{event.title}</h1>
          <p className="text-purple-200 text-lg max-w-2xl">{event.description}</p>
          <div className="mt-6 flex flex-wrap gap-4 text-purple-100 font-medium">
            <span className="bg-purple-800/80 backdrop-blur-md px-3 py-1 rounded-full border border-purple-700/50">
              📅 {new Date(event.date).toLocaleString()}
            </span>
            <span className="bg-purple-800/80 backdrop-blur-md px-3 py-1 rounded-full border border-purple-700/50">
              📍 {event.location}
            </span>
            <span className="bg-purple-800/80 backdrop-blur-md px-3 py-1 rounded-full border border-purple-700/50">
              👥 Capacity: {event.capacity || 'Unlimited'}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-6 shrink-0 w-full md:w-64">
           {/* Admin controls row */}
          <div className="flex gap-2">
            {event.is_active === false && (
               <span className="bg-red-500 text-white px-3 py-1 rounded-lg font-bold text-sm shadow-md flex items-center">Inactive</span>
            )}
            <form action={async () => {
               "use server";
               const { toggleEventActive } = await import("@repo/db");
               const { revalidatePath } = await import("next/cache");
               await toggleEventActive(event.id, event.is_active !== false);
               revalidatePath(`/admin/events/${id}`);
            }}>
              <button type="submit" className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2 rounded-xl backdrop-blur-sm border border-white/20 transition-colors shadow-sm">
                {event.is_active === false ? "Mark as Active" : "Mark as Inactive"}
              </button>
            </form>
          </div>

          {event.image_url ? (
            <div className="w-full aspect-video md:aspect-square bg-purple-800 rounded-xl overflow-hidden shadow-inner border border-purple-700/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
            </div>
          ) : (
             <div className="w-full aspect-video md:aspect-square bg-purple-800/50 rounded-xl border border-dashed border-purple-700 flex items-center justify-center text-purple-400 font-semibold text-sm">
               No Image Provide
             </div>
          )}
        </div>
      </div>

      {/* RSVPs Table */}
      <div>
        <h2 className="text-2xl font-bold text-purple-900 mb-4">Event Applications</h2>
        
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-50 border-b border-purple-100">
                <th className="p-4 font-semibold text-purple-800">Member Name</th>
                <th className="p-4 font-semibold text-purple-800">Email</th>
                <th className="p-4 font-semibold text-purple-800">Status</th>
                <th className="p-4 font-semibold text-purple-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rsvps.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-purple-500">
                    No applications for this event yet.
                  </td>
                </tr>
              ) : (
                rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="border-b border-purple-50 hover:bg-purple-50/50 transition-colors">
                    <td className="p-4 font-medium text-purple-900">
                      {rsvp.profiles?.username || rsvp.profiles?.full_name || 'Anonymous'}
                    </td>
                    <td className="p-4 text-purple-600">
                      {rsvp.profiles?.email || 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                        rsvp.status === 'attending' ? 'bg-green-100 text-green-700' :
                        rsvp.status === 'maybe' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {rsvp.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <form action={handleRemoveRsvp}>
                        <input type="hidden" name="rsvpId" value={rsvp.id} />
                        <button 
                          type="submit"
                          className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors font-bold text-sm rounded-lg"
                        >
                          Remove
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
