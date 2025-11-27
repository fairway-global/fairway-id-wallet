"use client";
import Image from "next/image";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

export default function Welcome() {
  const router = useRouter();
  return (
    <div className="w-full max-w-4xl bg-black rounded-[32px] border border-white/5 shadow-2xl grid grid-cols-1 overflow-hidden">
      <div className="flex flex-col items-center justify-center gap-8 p-10 bg-gradient-to-b from-[#0a0a0f] via-[#0a0a0f] to-[#0a0a0f]">
        <Image
          src="/wallet-home-icon.png"
          alt="Visualization"
          width={340}
          height={180}
          priority
        />
      </div>
      <div className="p-10 flex flex-col gap-4 text-white bg-gradient-to-b from-[#0c1123] via-[#0c1123] to-black rounded-t-[28px]">
        <div className="flex items-center gap-3">
          <Image
            src="/fairway-logo-only-white.png"
            alt="Fairway logo"
            width={62}
            height={62}
            priority
          />
          <p className="text-3xl font-bold leading-tight text-left">
            Welcome to Your
            <br />
            Professional ID Wallet
          </p>
        </div>

        <p className="font-thin italic text-left text-sm md:text-base">
          Hold shared your ID and Degrees securely, Get Hired 10x faster
        </p>

        <div className="mt-auto flex flex-col gap-y-4">
          <Button
            onPress={() => router.push("/setup/password")}
            color="warning"
            className="flex justify-between w-full max-w-96 mt-4 rounded-xl"
          >
            <span>CREATE A NEW WALLET</span>
            <span>&#8594;</span>
          </Button>
          <p
            onClick={() => router.push("/setup/verify?recover=true")}
            className="font-thin italic text-center cursor-pointer"
          >
            Recover An Existing Wallet
          </p>
        </div>
      </div>
    </div>
  );
}
