import { getEventById, getEventRSVPs } from "@repo/db";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MapPin, Calendar as CalendarIcon, Users, Clock, Info } from "lucide-react";
import RsvpForm from "./RsvpForm";

export default async function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { id: eventId } = await params;
  const event = await getEventById(eventId).catch(() => null);

  if (!event) {
    notFound();
  }

  // Get RSVPs to show total attending
  const rsvps = await getEventRSVPs(eventId).catch(() => []);
  const attendingCount = rsvps.filter((r) => r.status === "attending").length;

  // Determine user's current RSVP status
  const userRsvp = user ? rsvps.find((r) => r.user_id === user.id) : null;
  const currentStatus = userRsvp ? userRsvp.status : null;

  const eventDate = new Date(event.date);

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-purple-100 flex flex-col items-center">
        {/* Cover Image */}
        <div className="w-full h-80 bg-purple-50 flex items-center justify-center relative border-b border-purple-100">
          {event.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={event.image_url} 
              alt={event.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-purple-300 flex flex-col items-center gap-2">
              <CalendarIcon className="w-16 h-16 opacity-50" />
              <span className="font-semibold tracking-widest uppercase text-sm">No Cover Image</span>
            </div>
          )}
          
          <div className="absolute bottom-[-24px] left-8 bg-green-500 text-white shadow-lg border-4 border-white px-4 py-2 rounded-xl font-bold uppercase tracking-wide text-sm flex gap-2 items-center">
            <Info className="w-5 h-5"/> Verified Event
          </div>
        </div>

        {/* Info Container */}
        <div className="p-8 md:p-12 w-full pt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Main Details (Left 2/3) */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-black text-purple-950 leading-tight">{event.title}</h1>
              <p className="inline-flex mt-4 items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-bold shadow-sm">
                <Users className="w-4 h-4"/> 
                {attendingCount} {event.capacity ? `/ ${event.capacity}` : ''} Attending
              </p>
            </div>
            
            <div className="prose prose-purple max-w-none prose-p:leading-relaxed prose-p:font-medium prose-p:text-purple-800/80 mt-6">
              <h3 className="text-xl font-bold text-purple-900 border-b border-purple-100 pb-2 mb-4">About the Event</h3>
              <p className="whitespace-pre-wrap">{event.description}</p>
            </div>
          </div>

          {/* Sidebar logic (Right 1/3) */}
          <div className="space-y-6">
            <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100/50 shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-purple-900">Event Details</h3>
              
              <div className="flex gap-3 items-start">
                <CalendarIcon className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-purple-950 text-sm">Date</p>
                  <p className="text-purple-700/80 text-sm">{eventDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Clock className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-purple-950 text-sm">Time</p>
                  <p className="text-purple-700/80 text-sm">{eventDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-purple-950 text-sm">Location</p>
                  <p className="text-purple-700/80 text-sm">{event.location}</p>
                </div>
              </div>
            </div>

            {/* RSVP Form Block */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 text-center">
              <RsvpForm 
                eventId={eventId} 
                currentStatus={currentStatus} 
                isFull={event.capacity ? attendingCount >= event.capacity : false} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
