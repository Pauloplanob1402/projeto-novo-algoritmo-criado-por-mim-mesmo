import { NextRequest } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/serverClient";

export async function authenticateRequest(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace(/^Bearer\s+/i, "");

  if (!token) {
    return { error: "missing_token" as const };
  }

  const supabase = getSupabaseServerClient(token);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { error: "invalid_token" as const };
  }

  return { supabase, userId: data.user.id };
}
