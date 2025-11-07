"use client";

import FWLogoBox from "@/components/ui/FWLogoBox";
import { Button } from "@heroui/button";
import { Input } from "@heroui/react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const Seed = () => {
  const router = useRouter();
  // FIXME: Remove after demo
  const phrases: any = useMemo(() => {
    ["word1", "word2", "word3", "word4"];
  }, []);
  const [inputSeed, setInputSeed] = useState<Record<number, string>>({});
  const seedMatches: boolean = useMemo(() => {
    return phrases.every((phrase, index) => inputSeed[index] === phrase);
  }, [inputSeed, phrases]);

  const onCreateWallet = () => {
    router.push("/setup/password");
    // navigate to password creation
    // Verify seed is correct
    // Create a wallet via API
    // Show Success message
    // Navigate to dashboard
  };

  return (
    <div
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
      className={"bg-black py-8 px-2 flex flex-col items-start"}
    >
      <FWLogoBox />
      <div
        className={
          "self-center rounded-2xl bg-[#1D212C] flex flex-col items-center gap-2 max-w-96 mt-8 p-5 pb-12"
        }
      >
        <p className={"font-bold text-md text-white"}>Create a new Wallet</p>
        <p className={"text-gray-400"}>
          For your eyes only anyone who has these words can access your entire
          wallet! I&apos;ve saved these words
        </p>

        <div
          className={
            "relative w-full gap-x-2 p-4 text-lg font-semibold gap-y-1 bg-[#303841] text-white rounded-lg grid grid-cols-3 pb-12"
          }
        >
          {phrases.map((word, i) => (
            <div key={i} className="flex">
              <b className="text-fwNewGreen pr-2">{i + 1}</b>
              <Input
                type="text"
                size="sm"
                value={inputSeed[i] || ""} // Display the current value from state
                onChange={(e) =>
                  setInputSeed((prev) => ({
                    ...prev,
                    [i]: e.target.value.trim(), // Update the specific index with the new value
                  }))
                }
              />
            </div>
          ))}
          <Button
            // FIXME: Remove after demo
            onPress={() => {
              setInputSeed({ ...phrases });
            }}
            color="default"
            className={
              "absolute ml-[25%] -bottom-4 z-20 flex rounded-full gap-2 px-6 w-max mt-4"
            }
          >
            {!seedMatches ? (
              <>
                <span>Enter Correct Seed Phrase</span>
                <span>🔴</span>
              </>
            ) : (
              <>
                <span>Seed Phrase Matches</span>
                <span>✅</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <Button
        color="warning"
        className={
          "self-center mt-auto mb-0 flex justify-between w-full max-w-96"
        }
        // FIXME: enable after demo
        // isDisabled={!seedMatches}
        onPress={onCreateWallet}
      >
        <span>Continue</span>
        <span>&#8594;</span>
      </Button>
    </div>
  );
};

export default Seed;
