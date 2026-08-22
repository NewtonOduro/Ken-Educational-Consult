DROP POLICY IF EXISTS "Anyone can see taken slots" ON public.bookings;

REVOKE SELECT ON public.bookings FROM anon;

CREATE POLICY "Staff can read bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = ANY (ARRAY['admin'::app_role, 'staff'::app_role])
  ));

CREATE OR REPLACE FUNCTION public.get_booked_slots(from_date date, to_date date)
RETURNS TABLE (slot_date date, slot_time text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT b.slot_date, b.slot_time
  FROM public.bookings b
  WHERE b.status <> 'cancelled'
    AND b.slot_date >= from_date
    AND b.slot_date <= least(to_date, from_date + interval '120 days')
$$;

REVOKE ALL ON FUNCTION public.get_booked_slots(date, date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_booked_slots(date, date) TO anon, authenticated;
GRANT ALL ON FUNCTION public.get_booked_slots(date, date) TO service_role;