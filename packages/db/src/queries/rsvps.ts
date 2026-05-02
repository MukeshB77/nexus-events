import { supabase } from "../client";
import { RSVPRecord, ProfileRecord } from "../types";

export type EventRSVP = RSVPRecord & { profiles: ProfileRecord | null };

export async function getEventRSVPs(eventId: string): Promise<EventRSVP[]> {
  const { data: rsvps, error: rsvpsError } = await supabase
    .from("rsvps")
    .select("*")
    .eq("event_id", eventId);

  if (rsvpsError) throw rsvpsError;
  if (!rsvps || rsvps.length === 0) return [];

  // Fetch profiles for these users
  const userIds = rsvps.map(r => r.user_id);
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("*")
    .in("id", userIds);

  if (profilesError) throw profilesError;

  const profilesMap: Record<string, ProfileRecord> = {};
  if (profiles) {
    profiles.forEach(p => {
      profilesMap[p.id] = p as ProfileRecord;
    });
  }

  // Combine
  return rsvps.map(r => ({
    ...r,
    profiles: profilesMap[r.user_id] || null
  })) as EventRSVP[];
}

export type UserRSVP = RSVPRecord & { events: any };

export async function getUserRSVPs(userId: string): Promise<UserRSVP[]> {
  const { data, error } = await supabase
    .from("rsvps")
    .select(`
      *,
      events (*)
    `)
    .eq("user_id", userId);

  if (error) throw error;
  return data as UserRSVP[];
}
