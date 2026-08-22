import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarCheck,
  MessageCircle,
  MousePointerClick,
  Phone,
  Send,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { getDashboardSummary, type DashboardSummary } from "@/lib/dashboard.functions";
import { EVENT_LABELS } from "@/lib/analytics";
import { Button } from "@/components/ui/button";


const TITLE = "Conversion Dashboard | PACIFIC EDU CONSULT";
const DESCRIPTION =
  "Summary of consultation bookings, CTA clicks, WhatsApp opens, call taps and enquiry submissions for PACIFIC EDU CONSULT.";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
  errorComponent: ({ error }) => (
    <div role="alert" className="p-10 text-center text-sm">
      {error.message}
    </div>
  ),
});

type Summary = DashboardSummary;

const EVENT_ICONS: Record<string, typeof MousePointerClick> = {
  cta_click: MousePointerClick,
  whatsapp_open: MessageCircle,
  call_click: Phone,
  enquiry_submit: Send,
  booking_submit: CalendarCheck,
};

function Dashboard() {
  const fetchSummary = useServerFn(getDashboardSummary);
  const { data, isLoading, error } = useQuery<Summary>({
    queryKey: ["dashboard-summary"],
    queryFn: () => fetchSummary(),
    refetchInterval: 60_000,
    retry: false,
  });


  return (
    <div className="bg-mist min-h-screen">
      <header className="surface-navy">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6 md:px-6">
          <div>
            <p className="eyebrow text-gold">Conversion tracking</p>
            <h1 className="font-display mt-2 text-2xl font-bold sm:text-3xl">
              Performance summary
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="hover:text-gold inline-flex items-center gap-2 text-sm transition-colors"
            >
              <ArrowLeft className="size-4" /> Back to site
            </Link>
            <Button
              variant="glass"
              size="sm"
              onClick={() => {
                void supabase.auth.signOut();
              }}
            >
              Sign out
            </Button>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 md:px-6">
        {isLoading ? (
          <p className="text-muted-foreground text-sm">Loading summary…</p>
        ) : error ? (
          <p className="text-destructive text-sm">Could not load the summary.</p>
        ) : data ? (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat
                icon={CalendarCheck}
                label="Bookings"
                value={data.bookings_total}
                sub={`${data.bookings_last_7_days} in the last 7 days`}
              />
              <Stat
                icon={TrendingUp}
                label="Upcoming sessions"
                value={data.bookings_upcoming}
                sub="Scheduled from today"
              />
              <Stat
                icon={MousePointerClick}
                label="Tracked events"
                value={data.events_total}
                sub={`${data.events_last_7_days} in the last 7 days`}
              />
              <Stat
                icon={Send}
                label="Conversion rate"
                value={
                  data.events_total > 0
                    ? `${Math.round((data.bookings_total / data.events_total) * 100)}%`
                    : "—"
                }
                sub="Bookings per tracked interaction"
              />
            </section>

            <section className="mt-8 grid gap-4 lg:grid-cols-2">
              <Card title="Events by type">
                {data.events_by_name.length === 0 ? (
                  <Empty text="No events tracked yet." />
                ) : (
                  <ul className="space-y-3">
                    {data.events_by_name.map((row) => {
                      const Icon = EVENT_ICONS[row.event_name] ?? MousePointerClick;
                      return (
                        <li
                          key={row.event_name}
                          className="bg-muted/50 flex items-center justify-between gap-4 rounded-xl px-4 py-3"
                        >
                          <span className="flex items-center gap-3 text-sm font-medium">
                            <Icon className="text-primary size-4" />
                            {EVENT_LABELS[row.event_name] ?? row.event_name}
                          </span>
                          <span className="text-sm font-semibold">
                            {row.total}
                            <span className="text-muted-foreground ml-2 text-xs font-normal">
                              +{row.last_7_days} / 7d
                            </span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Card>

              <Card title="Bookings by consultation type">
                {data.bookings_by_type.length === 0 ? (
                  <Empty text="No bookings yet." />
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data.bookings_by_type}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis
                        dataKey="consultation_type"
                        tick={{ fontSize: 11 }}
                        interval={0}
                        tickFormatter={(v: string) => v.split(" ")[0] ?? v}
                      />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="total" fill="#1e3a8a" radius={6} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </section>

            <section className="mt-4">
              <Card title="Last 14 days">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={data.daily}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v: string) => v.slice(5)}
                    />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="events" stroke="#1e3a8a" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="bookings" stroke="#c9a227" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-muted-foreground mt-3 text-xs">
                  Navy line = tracked interactions · gold line = bookings.
                </p>
              </Card>
            </section>

            <p className="text-muted-foreground mt-8 text-xs">
              This page shows aggregate totals only — no visitor contact details are exposed.
            </p>
          </>
        ) : null}
      </main>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof MousePointerClick;
  label: string;
  value: number | string;
  sub: string;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-[var(--shadow-soft)]">
      <Icon className="text-gold size-5" />
      <p className="text-muted-foreground mt-4 text-xs font-semibold tracking-wide uppercase">
        {label}
      </p>
      <p className="font-display mt-1 text-3xl font-bold">{value}</p>
      <p className="text-muted-foreground mt-1 text-xs">{sub}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-[var(--shadow-soft)]">
      <h2 className="text-sm font-semibold tracking-wide uppercase">{title}</h2>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <p className="text-muted-foreground text-sm">{text}</p>;
}
