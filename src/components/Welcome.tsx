"use client";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

export default function Welcome() {
  const router = useRouter();
  return (
    <div className="grid grid-rows-[60%_40%] h-screen grid-flow-row-dense text-center">
      <div className="flex flex-col items-center justify-end gap-8 p-8">
        <Image
          src="/fw-logo.png"
          alt="Fairway logo"
          width={200}
          height={80}
          priority
        />
        <Image
          src="/visualization.png"
          alt="Visualization"
          width={350}
          height={300}
          priority
        />
      </div>
      <div className="bg-[#3F5A69] p-8 flex flex-col gap-2 text-white">
        <p className={"text-3xl font-bold text-left"}>
          Welcome to Fairway Wallet
        </p>
        <p className={"font-thin italic text-left"}>
          Its secure and support managing credentials
        </p>

        <div className="mt-auto flex flex-col gap-y-4">
          <Button
            onPress={() => router.push("/setup")}
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
