import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function DashboardSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-surface-900">Settings</h1>
        <p className="mt-2 text-slate-600">Update your city, pincode, notification channels, and plan settings.</p>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Profile & preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input defaultValue="Bengaluru" />
          <Input defaultValue="560001" />
          <Button>Save changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
