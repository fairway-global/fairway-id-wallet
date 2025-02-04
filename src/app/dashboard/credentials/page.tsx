"use client";
import { useEffect, useState } from "react";
import { IEducationCredential, IWorkCredential } from "@/utils/types";
import WorkCredential from "@/components/WorkCredential";
import EducationCredential from "@/components/EducationCredential";
import IdentityCredential from "@/components/IdentityCredential";
import NationalIDBadge from "@/components/ui/NationIDBadge";
import useStore from "@/store/store";

export default function Credentials() {
  const { identityCredential } = useStore();
  const [showEducation] = useState(false);
  const [showWork] = useState(false);
  const [educationCredentials, setEducationCredentials] = useState<
    IEducationCredential[]
  >([]);
  const [workCredentials, setWorkCredentials] = useState<IWorkCredential[]>([]);

  useEffect(() => {
    const uni: IEducationCredential = {
      id: 223,
      universityId: 1,
      did: "did:0x1234567890abcdef01234567890abcdef01234567",
      universityName: "Addis Ababa University",
      title: "Bsc in Accounting",
      gpa: 3.5,
      graduationDate: "02/2023",
      issuedDate: "02/02/2023",
      status: true,
      isNew: false,
    };
    setEducationCredentials([uni]);
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

  return (
    <div className="text-white p-2 flex flex-col gap-3">
      <IdentityCredential />
      {identityCredential && <NationalIDBadge />}

      {showEducation &&
        educationCredentials.map(
          (educationCredential: IEducationCredential, key) => (
            <EducationCredential
              key={key}
              educationCredential={educationCredential}
            />
          )
        )}
      {showWork &&
        workCredentials?.length &&
        workCredentials.map((workCredential: IWorkCredential, key) => (
          <WorkCredential key={key} workCredential={workCredential} />
        ))}
    </div>
  );
}
