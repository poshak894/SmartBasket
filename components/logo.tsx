import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl shadow-glow">
        <Image src="/icons/sbLogo.jpeg" alt="SmartBasket logo" width={44} height={44} className="h-full w-full object-cover" />
      </div>

      <div className="leading-tight">
        <p className="text-lg font-semibold text-brand-dark">SmartBasket</p>
        <p className="text-xs text-gray-500">instant price intelligence</p>
      </div>
    </Link>
  );
}
