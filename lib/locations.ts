export type SupportedLocation = {
  city: string;
  pincode: string;
  state: string;
};

export const supportedLocations: SupportedLocation[] = [
  { city: "Bengaluru", pincode: "560001", state: "Karnataka" },
  { city: "Mumbai", pincode: "400001", state: "Maharashtra" },
  { city: "Delhi", pincode: "110001", state: "Delhi" },
  { city: "Hyderabad", pincode: "500001", state: "Telangana" },
  { city: "Pune", pincode: "411001", state: "Maharashtra" },
  { city: "Chennai", pincode: "600001", state: "Tamil Nadu" },
  { city: "Kolkata", pincode: "700001", state: "West Bengal" },
  { city: "Ahmedabad", pincode: "380001", state: "Gujarat" },
  { city: "Jaipur", pincode: "302001", state: "Rajasthan" },
  { city: "Lucknow", pincode: "226001", state: "Uttar Pradesh" },
  { city: "Kochi", pincode: "682001", state: "Kerala" },
  { city: "Chandigarh", pincode: "160017", state: "Chandigarh" }
];

export function filterSupportedLocations(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return supportedLocations;
  }

  return supportedLocations.filter((location) =>
    [location.city, location.state, location.pincode].some((value) => value.toLowerCase().includes(normalized))
  );
}
