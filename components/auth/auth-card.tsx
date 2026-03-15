"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import Logo from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";

export function AuthCard({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState<"magic" | "google" | null>(null);

  const title = mode === "login" ? "Welcome back" : "Create your account";
  const description = mode === "login" ? "Sign in with email or continue with Google via Supabase Auth." : "Start saving on every instant-delivery order.";

  async function handleMagicLink() {
    if (!supabase) {
      toast.error("Supabase is not configured yet.");
      return;
    }

    if (!email) {
      toast.error("Enter your email address first.");
      return;
    }

    setLoading("magic");
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        data: mode === "signup" && name ? { full_name: name } : undefined
      }
    });

    setLoading(null);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Magic link sent. Check your inbox.");
  }

  async function handleGoogle() {
    if (!supabase) {
      toast.error("Supabase is not configured yet.");
      return;
    }

    setLoading("google");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    setLoading(null);

    if (error) {
      toast.error(error.message);
      return;
    }
  }

  return (
    <main className="container flex min-h-screen items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-2">
            <Logo />
          </div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mode === "signup" ? <Input placeholder="Full name" value={name} onChange={(event) => setName(event.target.value)} /> : null}
          <Input placeholder="Email address" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          <Button className="w-full" onClick={handleMagicLink} disabled={loading !== null}>
            {loading === "magic" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Send magic link
          </Button>
          <Button variant="secondary" className="w-full" onClick={handleGoogle} disabled={loading !== null}>
            {loading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Continue with Google
          </Button>
          <p className="text-sm text-slate-500">
            {mode === "login" ? "New here? " : "Already have an account? "}
            <Link className="text-brand-500" href={mode === "login" ? "/signup" : "/login"}>
              {mode === "login" ? "Create an account" : "Login"}
            </Link>
          </p>
          <Button variant="ghost" className="w-full" onClick={() => router.push("/")}>
            Back to home
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
