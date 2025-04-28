export interface Err {
  err: Error;
  section: string;
}

export interface IIdentityCredential {
  id: number;
  did: string;
  fullName: string;
  idProvider: string;
  birthDate: string;
  phoneNumber: string;
  gender: "M" | "F";
  city: string;
  country: string;
  status: "pending" | "active" | "archived";
  providerIdentifier: number;
  issuedDate?: string;
  expiryDate?: string;
  signed?: boolean;
}

export interface IEducationCredential {
  id: number;
  fullName: string;
  did: string;
  title: string;
  universityId: number;
  universityName: string;
  gpa: number;
  graduationDate: string;
  issuedDate?: string;
  expiryDate?: string;
  status: boolean;
  isNew: boolean;
  signed?: boolean;
}

export interface IWorkCredential {
  id: number;
  did: string;
  title: string;
  companyName: string;
  issuedDate: string;
  isNew: boolean;
  active: boolean;
  signed: boolean;
}

export interface AuthState {
  token: string;
  isAuthenticated: boolean;
}

export interface UserState {
  id: string;
  name: string;
  email: string;
}
