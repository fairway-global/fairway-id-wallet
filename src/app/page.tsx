import Image from "next/image";
import {Button} from '@nextui-org/button'; 

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
      <div className="bg-[#3F5A69] p-8 flex flex-col gap-2 text-white">
        <p className={'text-3xl '}>Welcome to Fairway Wallet</p>
        <p className={'font-thin italic'}>Its secure and support managing credentials</p>
        <Button color="warning" className={'flex justify-between w-full max-w-96'}>
            <span>CREATE A NEW WALLET</span>
            <span>&#8594;</span>
        </Button>
      </div>
    </div>
  );
}
