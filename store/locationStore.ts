import { create } from "zustand";
import { persist } from "zustand/middleware";

import { defaultCity, defaultPincode } from "@/lib/constants";

type LocationState = {
  city: string;
  pincode: string;
  setLocation: (city: string, pincode: string) => void;
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      city: defaultCity,
      pincode: defaultPincode,
      setLocation: (city, pincode) => set({ city, pincode })
    }),
    {
      name: "smartbasket-location"
    }
  )
);
