import { supabase } from "../client";
import { EventRecord } from "../types";

export async function createEvent(eventData: Omit<EventRecord, "id" | "created_at">): Promise<EventRecord> {
  const { data, error } = await supabase.from("events").insert([eventData]).select().single();
  if (error) throw error;
  return data as EventRecord;
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleEventActive(id: string, currentState: boolean): Promise<void> {
  const { error } = await supabase.from("events").update({ is_active: !currentState }).eq("id", id);
  if (error) throw error;
}
