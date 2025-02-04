"use client";

import { Button } from "@nextui-org/react";
import useStore from "../../../store/store";

export default function Settings() {
  const reset = useStore((state) => state.reset);
  const handleReset = () => {
    reset();
  };

  return (
    <div className="bg-black min-h-screen">
      <Button onPress={handleReset}>Reset</Button>
    </div>
  );
}
