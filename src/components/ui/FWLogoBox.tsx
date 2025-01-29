"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

export default function FWLogoBox() {
  const router = useRouter();
  const handleBack = () => {
    router.back(); // Navigate back
  };

  return (
    <div className="flex gap-2 items-center">
      <ChevronLeftIcon
        onClick={handleBack}
        className="w-10 h-10 text-gray-300 hover:text-white transition bg-transparent px-2"
      />
      <div className="rounded-lg bg-fwNewGreen px-2 py-0.5 w-max">
        <Image
          src="/fw-logo-h.png"
          alt="Fairway logo"
          width={180}
          height={30}
          priority
        />
      </div>
    </div>
  );
}
