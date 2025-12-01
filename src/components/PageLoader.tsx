import React from "react";
import Image from "next/image";
import { Spinner } from "@heroui/react";

interface IPageLoader {
  loaderText?: string;
  showProgress?: boolean;
}

const PageLoader: React.FC<IPageLoader> = ({
  loaderText = "",
  showProgress = false,
}) => {
  const [dots, setDots] = React.useState("");

  React.useEffect(() => {
    if (!showProgress) return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, [showProgress]);

  return (
    <div
      className="flex flex-col items-center min-h-[95vh] justify-center bg-gray-900"
      style={{ height: "calc(var(--vh, 1vh) * 100)" }}
      aria-label="Loading"
    >
      <div className="animate-pulse mb-8">
        <Image
          src="/fw-logo-white.png"
          alt="Logo"
          width={240}
          height={160}
          className="object-contain"
          priority
        />
      </div>
      <Spinner color="success" size="lg" />
      <p className="text-gray-100 mt-4">
        {loaderText}
        {showProgress && dots}
      </p>
      <p className="text-gray-400 text-sm mt-2">
        This may take a few moments...
      </p>
    </div>
  );
};

export default PageLoader;
