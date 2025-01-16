"use client";

import Image from "next/image";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function FWLogoBox() {
  const router = useRouter();
  const handleBack = () => {
    router.back(); // Navigate back
  };

  return (
    <div className="flex gap-2 items-center">
      <div className="rounded-lg bg-fwNewGreen px-2 py-0.5 w-max">
        <Image
          src="/fw-logo-h.png"
          alt="Fairway logo"
          width={180}
          height={30}
          priority
        />
      </div>
      <Button
        onPress={handleBack}
        size="sm"
        className={
          "flex items-center text-gray-300 hover:text-white transition bg-transparent px-0 w-max"
        }
      >
        <ArrowLeftIcon className="w-5 h-5" />
      </Button>
    </div>
  );
}
