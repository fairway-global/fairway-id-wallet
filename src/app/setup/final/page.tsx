"use client";

import FWLogoBox from "@/components/ui/FWLogoBox";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { TrophyIcon } from "@heroicons/react/24/outline";

const FinalSetup = () => {
  const router = useRouter();
  return (
    <div
      className={"bg-black py-8 px-2 flex flex-col items-start"}
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      <FWLogoBox />
      <div
        className={
          "self-center rounded-2xl bg-[#1D212C] flex flex-col items-center gap-2 max-w-96 mt-8 p-5 pb-12"
        }
      >
        <p className={"font-bold text-md text-white"}>You are all Done!</p>
        <p className={"text-gray-400 text-center"}>
          Your Fairway Professional ID wallet is setup successfully.
        </p>

        <div className="my-5">
          <TrophyIcon className="h-24 w-24 text-gray-200 self-center" />
        </div>

        <Button
          color="warning"
          className={
            "self-center mt-auto mb-0 flex justify-between w-full max-w-96"
          }
          // FIXME: enable after demo
          onPress={() => router.push("/dashboard")}
        >
          <span>Get Started</span>
          <span>&#8594;</span>
        </Button>
      </div>
    </div>
  );
};

export default FinalSetup;
