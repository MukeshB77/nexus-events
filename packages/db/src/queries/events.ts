import { supabase } from "../client";
import { EventRecord } from "../types";

export async function getEvents(): Promise<EventRecord[]> {
  const { data, error } = await supabase.from("events").select("*").order("date", { ascending: true });
  if (error) throw error;
  return data as EventRecord[];
}

export async function getEventById(id: string): Promise<EventRecord | null> {
  const { data, error } = await supabase.from("events").select("*").eq("id", id).single();
  if (error) throw error;
  return data as EventRecord;
}
