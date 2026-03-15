"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Share2, Trash2, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTeamStore } from "@/store/teamStore";

export function TeamWorkspace({ compact = false }: { compact?: boolean }) {
  const { enabled, members, sharedCarts, enableTeam, inviteMember, removeMember } = useTeamStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const memberCountLabel = useMemo(() => `${members.length}/5 seats used`, [members.length]);

  function handleInvite() {
    const result = inviteMember(name, email);
    if (result.ok) {
      toast.success(result.message);
      setName("");
      setEmail("");
    } else {
      toast.error(result.message);
    }
  }

  return (
    <Card className={compact ? "" : "max-w-4xl"}>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Team Workspace</CardTitle>
          <p className="mt-2 text-sm text-slate-500">
            Invite up to 5 members, share carts, and keep everyone aligned on the cheapest split checkout.
          </p>
        </div>
        <Badge variant={enabled ? "success" : "outline"}>{enabled ? "Team active" : "Upgrade to Team"}</Badge>
      </CardHeader>
      <CardContent className="space-y-5">
        {!enabled ? (
          <div className="rounded-2xl border border-surface-200 bg-surface-50 p-5">
            <div className="text-sm font-semibold text-surface-900">Team plan unlocks shared carts and teammate seats.</div>
            <div className="mt-2 text-sm text-slate-500">Turn it on here to simulate the team workflow before hooking billing fully.</div>
            <Button className="mt-4" onClick={enableTeam}>
              Enable Team features
            </Button>
          </div>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-2xl border border-surface-200 p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-surface-900">
                <Users className="h-4 w-4 text-brand-600" />
                Team members
              </div>
              <div className="text-xs text-slate-500">{memberCountLabel}</div>
            </div>

            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between rounded-xl bg-surface-50 px-3 py-3">
                  <div>
                    <div className="text-sm font-semibold text-surface-900">{member.name}</div>
                    <div className="text-xs text-slate-500">
                      {member.email} · {member.role}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.status === "Active" ? "success" : "outline"}>{member.status}</Badge>
                    {member.role !== "Owner" ? (
                      <Button variant="ghost" size="icon" onClick={() => removeMember(member.id)} aria-label={`Remove ${member.name}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            {!compact ? (
              <div className="mt-4 grid gap-3">
                <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Teammate name" />
                <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Teammate email" type="email" />
                <Button onClick={handleInvite} className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Invite teammate
                </Button>
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-surface-200 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-surface-900">
              <Share2 className="h-4 w-4 text-brand-600" />
              Shared carts
            </div>

            {sharedCarts.length ? (
              <div className="space-y-3">
                {sharedCarts.map((cart) => (
                  <div key={cart.id} className="rounded-xl bg-surface-50 px-3 py-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-surface-900">{cart.name}</div>
                      <Badge variant="outline">{cart.itemCount} items</Badge>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">Updated {new Date(cart.updatedAt).toLocaleDateString("en-IN")}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-surface-50 px-4 py-6 text-sm text-slate-500">
                Share a Smart Cart to make it visible here for your team.
              </div>
            )}

            <div className="mt-4 rounded-xl border border-dashed border-surface-200 bg-white px-4 py-4 text-sm text-slate-500">
              <div className="flex items-center gap-2 font-medium text-surface-900">
                <CheckCircle2 className="h-4 w-4 text-success-500" />
                Team workflow live
              </div>
              <div className="mt-2">Invite members here, then use Smart Cart to publish a shared basket for everyone.</div>
            </div>
          </div>
        </div>

        {compact && enabled ? (
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Teammate name" />
            <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Teammate email" type="email" />
            <Button onClick={handleInvite} className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
