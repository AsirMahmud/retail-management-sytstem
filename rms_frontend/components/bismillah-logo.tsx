"use client";

import { useBismillah } from "@/contexts/bismillah-context";

export function BismillahLogo() {
  const { showBismillah } = useBismillah();

  if (!showBismillah) return null;

  return (
    <div className="w-full bg-white py-2 px-4 text-center">
      <img src="bismillah.jpeg" alt="Bismillah" className="h-12 mx-auto" />
    </div>
  );
}
