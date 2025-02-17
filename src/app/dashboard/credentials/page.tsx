"use client";
import { useEffect, useState } from "react";
import { IEducationCredential, IWorkCredential } from "@/utils/types";
import WorkCredential from "@/components/WorkCredential";
import EducationCredential from "@/components/EducationCredential";
import IdentityCredential from "@/components/IdentityCredential";
import NationalIDBadge from "@/components/ui/NationIDBadge";
import useStore from "@/store/store";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";

export default function Credentials() {
  const router = useRouter();
  const { identityCredential } = useStore();
  const [showWork] = useState(false);
  const { educationCredentials } = useStore();
  const [workCredentials, setWorkCredentials] = useState<IWorkCredential[]>([]);

  useEffect(() => {
    // const uni: IEducationCredential = {
    //   id: 223,
    //   universityId: 1,
    //   did: "did:0x1234567890abcdef01234567890abcdef01234567",
    //   universityName: "Addis Ababa University",
    //   title: "Bsc in Accounting",
    //   gpa: 3.5,
    //   graduationDate: "02/2023",
    //   issuedDate: "02/02/2023",
    //   status: true,
    //   isNew: false,
    // };
    // setEducationCredentials([uni]);
    const work: IWorkCredential = {
      id: 234,
      did: "did:0x1234567890abcdef01234567890abcdef01234567",
      title: "Junior Accountant",
      companyName: "ABZ Technologies",
      issuedDate: "21/02/2024",
      isNew: true,
      active: true,
      signed: false,
    };
    setWorkCredentials([work]);
  }, []);

  const onAddCredential = () => {
    router.push("/dashboard/credentials/add");
  };

  return (
    <div className="text-white px-2 flex flex-col gap-3">
      <IdentityCredential />
      {identityCredential && <NationalIDBadge />}

      {educationCredentials.map(
        (educationCredential: IEducationCredential, key) => (
          <EducationCredential
            key={key}
            educationCredential={educationCredential}
          />
        )
      )}
      {identityCredential && (
        <Button
          size="sm"
          className={
            "flex justify-center text-fwNewGreen border border-fwNewGreen bg-transparent w-full"
          }
          onPress={onAddCredential}
        >
          Add New Credential
        </Button>
      )}
      {showWork &&
        workCredentials?.length &&
        workCredentials.map((workCredential: IWorkCredential, key) => (
          <WorkCredential key={key} workCredential={workCredential} />
        ))}
    </div>
  );
}
