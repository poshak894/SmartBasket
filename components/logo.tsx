import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary shadow-glow">
        <span className="text-sm font-bold text-white">SB</span>
      </div>

      <div className="leading-tight">
        <p className="text-lg font-semibold text-brand-dark">SmartBasket</p>
        <p className="text-xs text-gray-500">instant price intelligence</p>
      </div>
    </Link>
  );
}
