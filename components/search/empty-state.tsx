import { PackageSearch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Card className="flex flex-col items-center justify-center gap-4 p-10 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
        <PackageSearch className="h-8 w-8" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-surface-900">{title}</h3>
        <p className="mt-2 max-w-md text-sm text-slate-500">{subtitle}</p>
      </div>
      <Button variant="secondary">Try popular searches</Button>
    </Card>
  );
}
