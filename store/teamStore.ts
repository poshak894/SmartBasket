import { create } from "zustand";
import { persist } from "zustand/middleware";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Member";
  status: "Active" | "Invited";
};

type SharedCart = {
  id: string;
  name: string;
  itemCount: number;
  updatedAt: string;
};

type TeamState = {
  enabled: boolean;
  members: TeamMember[];
  sharedCarts: SharedCart[];
  enableTeam: () => void;
  inviteMember: (name: string, email: string) => { ok: boolean; message: string };
  removeMember: (memberId: string) => void;
  shareCart: (name: string, itemCount: number) => void;
};

const defaultMembers: TeamMember[] = [
  {
    id: "owner",
    name: "You",
    email: "owner@smartbasket.app",
    role: "Owner",
    status: "Active"
  }
];

export const useTeamStore = create<TeamState>()(
  persist(
    (set, get) => ({
      enabled: false,
      members: defaultMembers,
      sharedCarts: [],
      enableTeam: () => set({ enabled: true }),
      inviteMember: (name, email) => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();

        if (!trimmedName || !trimmedEmail) {
          return { ok: false, message: "Enter both name and email." };
        }

        if (get().members.some((member) => member.email === trimmedEmail)) {
          return { ok: false, message: "That teammate is already added." };
        }

        if (get().members.length >= 5) {
          return { ok: false, message: "Team plan supports up to 5 members." };
        }

        set((state) => ({
          enabled: true,
          members: [
            ...state.members,
            {
              id: crypto.randomUUID(),
              name: trimmedName,
              email: trimmedEmail,
              role: "Member",
              status: "Invited"
            }
          ]
        }));

        return { ok: true, message: "Teammate invited." };
      },
      removeMember: (memberId) =>
        set((state) => ({
          members: state.members.filter((member) => member.id !== memberId || member.role === "Owner")
        })),
      shareCart: (name, itemCount) =>
        set((state) => ({
          enabled: true,
          sharedCarts: [
            {
              id: crypto.randomUUID(),
              name: name.trim() || `Shared cart ${state.sharedCarts.length + 1}`,
              itemCount,
              updatedAt: new Date().toISOString()
            },
            ...state.sharedCarts
          ].slice(0, 6)
        }))
    }),
    {
      name: "smartbasket-team"
    }
  )
);

export type { TeamMember, SharedCart };
