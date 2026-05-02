"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createEvent } from "@repo/db";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

// Local schema for form validation
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startDate: z.string().min(1, "Start Date is required"),
  startTime: z.string().min(1, "Start Time is required"),
  location: z.string().min(1, "Location is required"),
  capacity: z.union([z.string(), z.number()]).optional(),
});

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: new Date().toISOString().split("T")[0],
      startTime: "12:00",
      location: "",
      capacity: 100,
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData?.user?.id) {
        throw new Error("You must be logged in to create an event.");
      }

      let image_url = undefined;

      // Handle image upload if a file was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("event-images")
          .upload(fileName, imageFile, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          throw new Error("Image upload failed: " + uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
          .from("event-images")
          .getPublicUrl(fileName);

        image_url = publicUrlData.publicUrl;
      }

      // Combine date and time
      const combinedDate = new Date(`${data.startDate}T${data.startTime}`).toISOString();

      await createEvent({
        title: data.title,
        description: data.description,
        date: combinedDate,
        location: data.location,
        capacity: data.capacity ? Number(data.capacity) : undefined,
        image_url: image_url,
        organizer_id: userData.user.id
      });

      router.push("/admin/events");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create event");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 space-y-6">
      <div className="mb-4">
        <Button 
          variant="ghost" 
          onClick={() => router.push("/admin/events")}
          className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 -ml-2 font-semibold"
        >
          ← Back to Admin Events
        </Button>
      </div>
      <div>
        <h1 className="text-3xl font-extrabold text-purple-900">Create New Event</h1>
        <p className="text-purple-600 mt-2">Publish an event with an image and details.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-purple-100">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

            <div className="space-y-2">
              <label className="text-purple-900 font-semibold block text-sm">Event Cover Image</label>
              <div className="border-2 border-dashed border-purple-200 rounded-xl p-6 flex flex-col items-center justify-center bg-purple-50/50 hover:bg-purple-100 transition-colors relative cursor-pointer group">
                 <input 
                  type="file" 
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }} 
                 />
                 <div className="text-purple-400 mb-2 group-hover:scale-110 transition-transform">
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                 </div>
                 <p className="text-sm font-semibold text-purple-700">
                    {imageFile ? imageFile.name : "Click or drag to upload cover image"}
                 </p>
                 <p className="text-xs text-purple-500 mt-1">Supported formats: JPG, PNG, WEBP.</p>
              </div>
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-900 font-semibold">Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Spring Hackathon 2026" className="border-purple-200" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-purple-900 font-semibold">Description</FormLabel>
                  <FormControl>
                    <textarea 
                      placeholder="Brief description of the event" 
                      className="flex min-h-[120px] w-full rounded-md border border-purple-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-900 font-semibold">Start Date</FormLabel>
                    <FormControl>
                      <Input type="date" className="border-purple-200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => {
                  const timeParts = field.value ? field.value.split(":") : ["12", "00"];
                  let h24 = parseInt(timeParts[0] || "12", 10);
                  const min = timeParts[1] || "00";
                  const ampm = h24 >= 12 ? "PM" : "AM";
                  
                  let h12 = h24 % 12;
                  if (h12 === 0) h12 = 12;
                  const h12Str = h12.toString().padStart(2, "0");

                  const updateTime = (newH12: string, newMin: string, newAmpm: string) => {
                    let h24Num = parseInt(newH12, 10);
                    if (newAmpm === "PM" && h24Num < 12) h24Num += 12;
                    if (newAmpm === "AM" && h24Num === 12) h24Num = 0;
                    const finalH24 = h24Num.toString().padStart(2, "0");
                    field.onChange(`${finalH24}:${newMin}`);
                  };

                  return (
                    <FormItem>
                      <FormLabel className="text-purple-900 font-semibold">Start Time</FormLabel>
                      <div className="flex gap-2">
                        <select 
                          className="flex h-10 w-full rounded-md border border-purple-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                          value={h12Str}
                          onChange={(e) => updateTime(e.target.value, min, ampm)}
                        >
                          {Array.from({length: 12}, (_, i) => {
                            const v = (i + 1).toString().padStart(2, "0");
                            return <option key={v} value={v}>{v}</option>;
                          })}
                        </select>
                        <span className="self-center font-bold text-purple-900">:</span>
                        <select 
                          className="flex h-10 w-full rounded-md border border-purple-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                          value={min}
                          onChange={(e) => updateTime(h12Str, e.target.value, ampm)}
                        >
                          {["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"].map(v => (
                            <option key={v} value={v}>{v}</option>
                          ))}
                        </select>
                        <select 
                          className="flex h-10 w-full rounded-md border border-purple-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                          value={ampm}
                          onChange={(e) => updateTime(h12Str, min, e.target.value)}
                        >
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                        </select>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-900 font-semibold">Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Main Hall" className="border-purple-200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-purple-900 font-semibold">Capacity (Optional)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" className="border-purple-200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold h-12 shadow-md rounded-xl mt-6"
            >
              {loading ? "Publishing..." : "Publish Event"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
