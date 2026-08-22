import { createClient } from "@supabase/supabase-js";
import type { ToolContext } from "@lovable.dev/mcp-js";
import type { Database } from "@/integrations/supabase/types";

type RuntimeGlobals = typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
};

function runtimeEnv(name: string): string | undefined {
  return (globalThis as RuntimeGlobals).process?.env?.[name];
}

function configuredEnv(names: readonly string[]): string | undefined {
  for (const name of names) {
    const value = runtimeEnv(name)?.trim();
    if (value) return value;
  }
  return undefined;
}

function supabaseProjectUrl(): string {
  const url = configuredEnv(["SUPABASE_URL", "VITE_SUPABASE_URL"]);
  if (!url) throw new Error("SUPABASE_URL is required");
  return url;
}

function supabasePublishableKey(): string {
  const key = configuredEnv([
    "SUPABASE_PUBLISHABLE_KEY",
    "VITE_SUPABASE_PUBLISHABLE_KEY",
    "SUPABASE_ANON_KEY",
  ]);
  if (!key) throw new Error("SUPABASE_PUBLISHABLE_KEY is required");
  return key;
}

/** Client acting as the signed-in user; RLS applies as that user. */
export function supabaseForUser(ctx: ToolContext) {
  const token = ctx.getToken();
  if (!token) throw new Error("This tool requires a verified sign-in");
  return createClient<Database>(supabaseProjectUrl(), supabasePublishableKey(), {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type StaffRole = "admin" | "staff";

/**
 * Resolves the caller's business role from their own token (RLS-scoped read of
 * their role rows). Returns null when the signed-in user is not team staff.
 */
export async function resolveStaffRole(ctx: ToolContext): Promise<StaffRole | null> {
  if (!ctx.isAuthenticated()) return null;
  const supabase = supabaseForUser(ctx);
  const { data, error } = await supabase.from("user_roles").select("role");
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((row) => row.role);
  if (roles.includes("admin")) return "admin";
  if (roles.includes("staff")) return "staff";
  return null;
}

/**
 * Privileged read client, used ONLY after resolveStaffRole confirmed the caller
 * is team staff. Contact details live behind column grants, so the verified
 * admin read happens here rather than by widening table access to every user.
 */
export async function supabaseTrusted() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

export function deniedResult(message: string) {
  return { content: [{ type: "text" as const, text: message }], isError: true };
}
