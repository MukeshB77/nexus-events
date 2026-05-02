import { supabase } from "../client";
import { RSVPRecord } from "../types";

export async function createRSVP(rsvpData: Omit<RSVPRecord, "id" | "created_at">): Promise<RSVPRecord> {
  // Upsert the RSVP
  const { data, error } = await supabase
    .from("rsvps")
    .upsert([rsvpData], { onConflict: "event_id,user_id" })
    .select()
    .single();

  if (error) throw error;
  return data as RSVPRecord;
}

export async function deleteRSVP(id: string): Promise<void> {
  const { error } = await supabase.from("rsvps").delete().eq("id", id);
  if (error) throw error;
}
