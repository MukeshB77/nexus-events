export type EventRecord = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  capacity?: number;
  image_url?: string;
  is_active?: boolean;
  organizer_id: string;
  created_at: string;
};

export type RSVPRecord = {
  id: string;
  event_id: string;
  user_id: string;
  status: "attending" | "maybe" | "declined";
  created_at: string;
};

export type ProfileRecord = {
  id: string;
  role: "admin" | "member";
  email: string;
  username?: string;
  full_name?: string;
  created_at: string;
};
