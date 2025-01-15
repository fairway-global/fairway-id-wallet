export interface IEducationCredential {
  id: number;
  title: string;
  universityId: number;
  universityName: string;
  gpa: number;
  graduationDate: string;
  issuedDate: string;
  expiryDate?: string;
  status: boolean;
  isNew: boolean;
  signed?: boolean;
}

export interface IWorkCredential {
  id: number;
  title: string;
  companyName: string;
  issuedDate: string;
  isNew: boolean;
  active: boolean;
  signed: boolean;
}
