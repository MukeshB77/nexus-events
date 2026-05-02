import { supabase } from "../client";

export async function getDashboardStats() {
  // Total members
  const { count: membersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .neq("role", "admin");

  // Total events
  const { count: eventsCount } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true });

  // Finished / Inactive events
  const { count: finishedEventsCount } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("is_active", false);

  // Active events
  const { count: activeEventsCount } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  // Members attending events
  const { count: attendingCount } = await supabase
    .from("rsvps")
    .select("*", { count: "exact", head: true })
    .eq("status", "attending");

  return {
    totalMembers: membersCount || 0,
    totalEvents: eventsCount || 0,
    activeEvents: activeEventsCount || 0,
    finishedEvents: finishedEventsCount || 0,
    attendingMembers: attendingCount || 0,
  };
}

export async function getDashboardChartData() {
  // Fetch up to 10 events to RSVPs
  const { data: events, error } = await supabase
    .from("events")
    .select("id, title, date")
    .order("date", { ascending: false })
    .limit(10);

  if (error) throw error;

  const chartData = [];

  for (const event of events) {
    const { count } = await supabase
      .from("rsvps")
      .select("*", { count: "exact", head: true })
      .eq("event_id", event.id)
      .eq("status", "attending");

    chartData.push({
      name: event.title.substring(0, 15) + (event.title.length > 15 ? "..." : ""),
      attendees: count || 0,
    });
  }

  return chartData.reverse(); // left to right
}
