export interface User {
  id: number;
  name: string;
  role: "coach" | "student";
  phone_number: string;
}

export interface Slot {
  id: number;
  coach_id: number;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  student_id?: number;
}

export interface Call {
  id: number;
  slot_id: number;
  coach_id: number;
  student_id: number;
  satisfaction?: number;
  notes?: string;
  created_at: string;
}
