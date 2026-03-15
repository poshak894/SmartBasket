import { prisma } from "@/lib/prisma/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getCurrentAppUser() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return null;
  }

  const fullName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email.split("@")[0];

  const avatarUrl = user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? null;

  return prisma.user.upsert({
    where: { email: user.email },
    update: {
      name: fullName,
      avatarUrl
    },
    create: {
      email: user.email,
      name: fullName,
      avatarUrl
    }
  });
}
