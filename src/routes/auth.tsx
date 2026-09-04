import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowLeft, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TITLE = "Staff sign in | Ken Educational Consult";
const DESCRIPTION =
  "Secure sign in for Ken Educational Consult staff to access the internal conversion dashboard.";

/** Only same-origin relative paths may be used as a post-sign-in destination. */
function safeNext(value: unknown): string | null {
  if (typeof value !== "string") return null;
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    next: safeNext(search["next"]) ?? undefined,
  }),
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
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { next } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (signInError) {
      setError("Sign in failed. Check your email and password.");
      return;
    }
    const destination = safeNext(next);
    if (destination) {
      window.location.href = destination;
      return;
    }
    void navigate({ to: "/dashboard" });
  }

  return (
    <div className="bg-mist flex min-h-screen items-center justify-center px-5 py-16">
      <div className="bg-card w-full max-w-md rounded-3xl border border-border p-8 shadow-[var(--shadow-soft)]">
        <Lock className="text-gold size-6" />
        <h1 className="font-display mt-4 text-2xl font-bold">Staff sign in</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          The conversion dashboard is restricted to Ken Educational Consult team accounts.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? (
            <p role="alert" className="text-destructive text-sm">
              {error}
            </p>
          ) : null}
          <Button type="submit" variant="navy" className="w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <Link
          to="/"
          className="text-muted-foreground hover:text-foreground mt-6 inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to site
        </Link>
      </div>
    </div>
  );
}
