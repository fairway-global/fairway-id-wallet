'use client';

import FWLogoBox from "@/components/ui/FWLogoBox";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/react";
import { useMemo, useState } from "react";

const Seed = () => {
  const [inputMode, setInputMode ] = useState(false);
  const [inputSeed, setInputSeed] = useState<Record<number, string>>({}); 
  const phrases = [
    "spoil",
    "typical",
    "maze",
    "drop",
    "frequent",
    "keep",
    "ball",
    "aware",
    "another",
    "wasp",
    "dose",
    "naive"
  ];

  // Check if the inputSeed matches the correct phrases
  const seedMatches: boolean = useMemo(() => {
    // Ensure all phrases match and are entered in the correct order
    return phrases.every((phrase, index) => inputSeed[index] === phrase);
  }, [inputSeed, phrases]);

  return (
    <div className={"h-screen bg-black py-8 px-2 flex flex-col items-start"}>
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
              {inputMode ? (
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
              ) : (
                word
              )}
            </div>
          ))}
          <Button
            color="default"
            className={
              "absolute ml-[25%] -bottom-4 z-20 flex rounded-full gap-2 px-6 w-max mt-4"
            }
          >
            {inputMode ? (
              !seedMatches ? (
                <>
                  <span>Enter Correct Seed Phrase</span>
                  <span>🔴</span>
                </>
              ) : (
                <>
                  <span>Seed Phrase Matches</span>
                  <span>✅</span>
                </>
              )
            ) : (
              <>
                <span>📋</span>
                <span>Copy to clipboard</span>
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
        isDisabled={inputMode && !seedMatches}
        onPress={() => setInputMode(true)}
      >
        <span>Continue</span>
        <span>&#8594;</span>
      </Button>
    </div>
  );
};

export default Seed;
