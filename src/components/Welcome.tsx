"use client";
import Image from "next/image";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

export default function Welcome() {
  const router = useRouter();
  return (
    <div
      className="bg-black only:grid grid-rows-[60%_40%] grid-flow-row-dense text-center"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      <div className="flex flex-col items-center justify-end gap-8 p-8">
        <Image
          src="/wallet-home-icon.png"
          alt="Visualization"
          width={300}
          height={200}
          priority
        />
      </div>
      <div className="p-8 flex flex-col gap-2 text-white mb-4">
        <div className="flex gap-2 justify-center mb-4">
          <Image
            src="/fairway-logo-only-white.png"
            alt="Fairway logo"
            width={120}
            height={120}
            priority
          />
          <p className={"text-3xl font-bold text-left"}>
            Welcome to Your Professional ID Wallet
          </p>
        </div>

        <p className={"font-thin italic text-left"}>
          Hold shared your ID and Degrees securely, Get Hired 10x faster
        </p>

        <div className="mt-auto flex flex-col gap-y-4">
          <Button
            onPress={() => router.push("/setup/password")}
            color="warning"
            className={"flex justify-between w-full max-w-96 mt-4"}
          >
            <span>CREATE A NEW WALLET</span>
            <span>&#8594;</span>
          </Button>
          <p
            onClick={() => router.push("/setup/verify?recover=true")}
            className={"font-thin italic text-center"}
          >
            Recover An Existing Wallet
          </p>
        </div>
      </div>
    </div>
  );
}
