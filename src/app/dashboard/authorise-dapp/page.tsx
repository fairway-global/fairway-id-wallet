// app/dashboard/authorize-dapp/page.tsx (New File: Full Authorize DApp Page)
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@heroui/react";
import BlurredCard from "@/components/ui/BlurredCard";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useMemo } from "react";
import { toast } from "sonner";

export default function AuthorizeDApp() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract DApp info from query params (e.g., ?dappName=ExampleDApp&permissions=access_credentials)
  const dappName = useMemo(
    () => searchParams.get("dappName") || "Unknown DApp",
    [searchParams]
  );
  const permissions = useMemo(() => {
    const perms = searchParams.get("permissions")?.split(",") || [
      "Access to credentials",
    ];
    return perms.map((perm) => perm.trim());
  }, [searchParams]);

  const handleAuthorize = () => {
    // TODO: Integrate actual authorization logic (e.g., sign message, store consent)
    toast.success(`Authorized access for ${dappName}`);
    router.replace("https://trustless-lend-verify.lovable.app/");
  };

  const handleCancel = () => {
    toast.info(`Authorization cancelled for ${dappName}`);
    router.back();
  };

  return (
    <div className="flex flex-col items-center text-white gap-4 p-4">
      <BlurredCard bgColor="#00F4C8" className="p-6 w-full max-w-md">
        <div className="flex flex-col items-center gap-4">
          <Image
            alt="DApp Authorization Icon"
            src="/id-verified.svg" // Reuse existing icon or add a new one
            height={80}
            width={80}
          />
          <h2 className="text-xl font-bold text-center">
            Authorize DApp Access
          </h2>
          <p className="text-center text-gray-300">
            {dappName} is requesting access to your wallet.
          </p>
          <div className="w-full">
            <p className="text-sm font-semibold mb-2">Requested Permissions:</p>
            <ul className="list-disc pl-4 text-sm text-gray-300">
              {permissions.map((perm, index) => (
                <li key={index}>{perm}</li>
              ))}
            </ul>
          </div>
          <div className="flex justify-between w-full gap-4 mt-4">
            <Button
              size="md"
              className="flex justify-center text-white bg-fwNewGreen w-full"
              onPress={handleAuthorize}
            >
              <CheckIcon className="h-5 w-5 mr-2" />
              Authorise
            </Button>
            <Button
              size="md"
              className="flex justify-center text-fwNewRed border border-fwNewRed bg-transparent w-full"
              onPress={handleCancel}
            >
              <XMarkIcon className="h-5 w-5 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </BlurredCard>
    </div>
  );
}
