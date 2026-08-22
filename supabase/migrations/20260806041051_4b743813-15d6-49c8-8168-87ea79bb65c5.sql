-- 1. Staff roles
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid());

-- 2. Drop publicly-callable SECURITY DEFINER functions
DROP FUNCTION IF EXISTS public.get_dashboard_summary();
DROP FUNCTION IF EXISTS public.get_booked_slots(date, date);

-- 3. Bookings: replace always-true insert policy with validated one
DROP POLICY IF EXISTS "Anyone can request a booking" ON public.bookings;

CREATE POLICY "Anyone can request a booking"
ON public.bookings FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'pending'
  AND slot_date >= current_date
  AND char_length(full_name) BETWEEN 2 AND 120
  AND char_length(email) BETWEEN 5 AND 200
  AND email LIKE '%_@_%.__%'
  AND char_length(phone) BETWEEN 6 AND 40
  AND char_length(consultation_type) BETWEEN 2 AND 80
  AND char_length(slot_time) BETWEEN 3 AND 20
  AND (destination IS NULL OR char_length(destination) <= 120)
  AND (notes IS NULL OR char_length(notes) <= 2000)
  AND meeting_mode IN ('in_person', 'whatsapp', 'phone', 'video')
);

-- 4. Availability: expose only slot_date/slot_time via column-level grants
CREATE POLICY "Anyone can see taken slots"
ON public.bookings FOR SELECT TO anon, authenticated
USING (status <> 'cancelled');

REVOKE SELECT ON public.bookings FROM anon, authenticated;
GRANT SELECT (slot_date, slot_time) ON public.bookings TO anon, authenticated;
GRANT ALL ON public.bookings TO service_role;

-- 5. Analytics: replace always-true insert policy with validated one
DROP POLICY IF EXISTS "Anyone can log an analytics event" ON public.analytics_events;

CREATE POLICY "Anyone can log an analytics event"
ON public.analytics_events FOR INSERT TO anon, authenticated
WITH CHECK (
  event_name IN ('cta_click', 'whatsapp_open', 'call_click', 'enquiry_submit', 'booking_submit')
  AND (label IS NULL OR char_length(label) <= 120)
  AND (path IS NULL OR char_length(path) <= 200)
);

GRANT ALL ON public.analytics_events TO service_role;