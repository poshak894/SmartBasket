import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";

export default function DottedGlowBackgroundDemo() {
  return (
    <div className="relative h-[500px] w-full overflow-hidden rounded-xl">
      <DottedGlowBackground
        color="rgba(75,46,43,0.7)"
        glowColor="rgba(192,133,82,0.9)"
        gap={14}
        radius={1.8}
        opacity={0.7}
        speedMin={0.4}
        speedMax={1.2}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-5xl font-bold text-[#4B2E2B]">SmartBasket</h1>
      </div>
    </div>
  );
}
