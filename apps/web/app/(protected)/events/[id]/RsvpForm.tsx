"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { rsvpForEvent } from "./actions";
import { Button } from "@/components/ui/button";

export default function RsvpForm({ 
  eventId, 
  currentStatus,
  isFull
}: { 
  eventId: string; 
  currentStatus: string | null;
  isFull: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleAction = (status: "attending" | "maybe" | "declined") => {
    startTransition(async () => {
      await rsvpForEvent(eventId, status);
      if (status === "attending") {
        router.push("/dashboard/my-events");
      }
    });
  };

  return (
    <div className="space-y-4">
      {currentStatus === "attending" ? (
         <div>
           <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-xl font-bold mb-4 w-full border border-green-200">
             You are Attending! 🎉
           </div>
           <Button 
              variant="outline"
              disabled={isPending}
              onClick={() => handleAction("declined")}
              className="w-full text-purple-600 border-purple-200"
            >
              Cancel RSVP
            </Button>
         </div>
      ) : (
        <>
          <h3 className="font-bold text-purple-900">Are you going?</h3>
          {isFull ? (
             <div className="bg-red-50 text-red-600 p-2 rounded-lg text-sm font-bold">
               Event is at capacity.
             </div>
          ) : (
             <Button 
                onClick={() => handleAction("attending")}
                disabled={isPending}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold h-12 shadow-md rounded-xl"
              >
                {isPending ? "Confirming..." : "RSVP Now!"}
              </Button>
          )}
        </>
      )}
    </div>
  );
}
