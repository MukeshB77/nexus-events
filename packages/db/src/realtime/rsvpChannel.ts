import { supabase } from "../client";

export function subscribeToRSVPs(eventId: string, callback: (payload: any) => void) {
  const channel = supabase
    .channel(`public:rsvps:event_id=eq.${eventId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "rsvps",
        filter: `event_id=eq.${eventId}`,
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
