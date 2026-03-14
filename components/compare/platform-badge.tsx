import { platforms } from "@/lib/mock/data";
import { Platform } from "@/types";

export function PlatformBadge({ platform }: { platform: Platform }) {
  const meta = platforms.find((entry) => entry.id === platform);

  return (
    <div className="inline-flex items-center gap-2 rounded-pill bg-surface-100 px-3 py-1 text-xs font-medium text-surface-900">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta?.color }} />
      {meta?.label ?? platform}
    </div>
  );
}
