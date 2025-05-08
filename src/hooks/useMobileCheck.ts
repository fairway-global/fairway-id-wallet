import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useMobileCheck() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoding, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const regex =
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|Tablet/i;
    const mobile = regex.test(navigator.userAgent) || "ontouchstart" in window;
    setIsMobile(mobile);
    setIsLoading(false);
  }, [isClient, router]);

  return { isMobile, isLoding };
}
