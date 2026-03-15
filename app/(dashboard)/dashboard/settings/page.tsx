"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

import { TeamWorkspace } from "@/components/team/team-workspace";
import { useLocationStore } from "@/store/locationStore";

export default function DashboardSettingsPage() {
  const { city, pincode, setLocation } = useLocationStore();
  const [nextCity, setNextCity] = useState(city);
  const [nextPincode, setNextPincode] = useState(pincode);

  useEffect(() => {
    setNextCity(city);
    setNextPincode(pincode);
  }, [city, pincode]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-surface-900">Settings</h1>
        <p className="mt-2 text-slate-600">Update your city, pincode, notification channels, plan settings, and team workspace.</p>
      </div>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Profile & preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={nextCity} onChange={(event) => setNextCity(event.target.value)} />
          <Input value={nextPincode} onChange={(event) => setNextPincode(event.target.value)} />
          <Button onClick={() => setLocation(nextCity.trim() || city, nextPincode.trim() || pincode)}>Save changes</Button>
        </CardContent>
      </Card>
      <TeamWorkspace />
    </div>
  );
}
