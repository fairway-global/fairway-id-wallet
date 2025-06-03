import Image from "next/image";

const NationalIDBadge = () => {
  return (
    <div className="h-[114px] rounded-xl p-6 bg-fwNewGreen grid grid-cols-[1fr_75px] grid-rows-1 w-full">
      <div className="flex flex-col gap-1 text-gray-700 font-semibold">
        <p className="text-sm">
          Identity Verified
          <span className="text-red-400 text-xs pl-2">(DEMO ONLY)</span>
        </p>
        <p className="text-lg">Ethiopian National ID</p>
      </div>
      <div className="flex justify-center items-center bg-[#00A385] w-[75px] h-[75px] rounded-full">
        <Image
          alt="National ID/Fayda Logo"
          src={"/verified-white.svg"}
          height={50}
          width={50}
        />
      </div>
    </div>
  );
};

export default NationalIDBadge;
