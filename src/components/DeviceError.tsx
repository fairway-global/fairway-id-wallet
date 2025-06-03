import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

export default function DeviceError() {
  return (
    <div
      className="flex items-center justify-center bg-[#1A2238]"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md mx-auto flex flex-col items-center">
        <ExclamationTriangleIcon
          height={80}
          width={80}
          className="text-red-500"
        />
        <h1 className="mt-4 text-2xl font-bold text-gray-800">
          Device Not Supported
        </h1>

        <p className="mt-2 text-gray-600">
          Sorry, the wallet is only accessible on mobile devices. Please visit
          us from a smartphone or tablet.
        </p>
      </div>
    </div>
  );
}
