"use client";

import { useTransition } from "react";
import { rsvpForEvent } from "../../events/[id]/actions";

export function StatusSelector({ eventId, currentStatus }: { eventId: string, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as "attending" | "maybe" | "declined";
    if (newStatus !== currentStatus) {
      startTransition(async () => {
        await rsvpForEvent(eventId, newStatus);
      });
    }
  };

  return (
    <select 
      value={currentStatus} 
      onChange={handleStatusChange} 
      disabled={isPending}
      className={`w-full p-2 border rounded-lg text-sm font-semibold outline-none transition-colors ${
        isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } ${
        currentStatus === 'attending' ? 'border-green-300 text-green-700 bg-green-50' :
        currentStatus === 'maybe' ? 'border-yellow-300 text-yellow-700 bg-yellow-50' :
        'border-red-300 text-red-700 bg-red-50'
      }`}
    >
      <option value="attending">Going</option>
      <option value="maybe">Maybe</option>
      <option value="declined">Not Going</option>
    </select>
  );
}
