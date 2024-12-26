import Image from "next/image";
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="grid grid-rows-[60%_40%] h-screen grid-flow-row-dense">
      <div className="flex flex-col items-center justify-between p-8"> 
        <Image
          src="/fw-logo.png"
          alt="Fairway logo"
          width={180}
          height={38}
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
      <div className="bg-[#3F5A69]">
        <p>Welcome to Fairway Wallet</p>
        <p>Its secure and support managing credentials</p>
        <Button colorPalette={'orange'} >Click me</Button>
      </div>
    </div>
  );
}
