"use client";

import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

export default function ThreeDCardDemo() {
  return (
    <CardContainer className="inter-var">
      <CardBody className="w-[30rem] rounded-xl border border-[#8C5A3C]/20 bg-[#FFF8F0] p-6 shadow-card">
        <CardItem translateZ="50" className="text-xl font-bold text-[#4B2E2B]">
          SmartBasket Price Intelligence
        </CardItem>

        <CardItem translateZ="60" as="p" className="mt-2 text-sm text-[#8C5A3C]">
          Compare grocery prices across multiple platforms instantly.
        </CardItem>

        <CardItem translateZ="100" className="mt-4">
          <img
            src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=900&q=80"
            alt="SmartBasket grocery comparison preview"
            className="h-60 w-full rounded-xl object-cover"
          />
        </CardItem>

        <div className="mt-10 flex justify-between">
          <CardItem
            as="button"
            translateZ={20}
            className="rounded-lg border border-[#C08552] px-4 py-2 text-xs text-[#4B2E2B]"
          >
            Explore -
          </CardItem>

          <CardItem
            as="button"
            translateZ={20}
            className="rounded-lg bg-[#C08552] px-4 py-2 text-xs text-white shadow-glow"
          >
            Try demo
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
}
