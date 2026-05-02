"use server";

import { revalidatePath } from "next/cache";
import { createRSVP } from "@repo/db";
import { createClient } from "@/lib/supabase/server";

export async function rsvpForEvent(eventId: string, status: "attending" | "maybe" | "declined") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to RSVP");
  }

  await createRSVP({
    event_id: eventId,
    user_id: user.id,
    status
  });

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/dashboard");
}
