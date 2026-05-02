import { z } from "zod";

export const eventSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().datetime(),
  location: z.string().min(1, "Location is required"),
  capacity: z.number().int().positive().optional(),
  image_url: z.string().url().optional(),
  organizerId: z.string().uuid(),
});

export type Event = z.infer<typeof eventSchema>;
