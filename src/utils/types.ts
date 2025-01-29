import SDK from "@hyperledger/identus-edge-agent-sdk";

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
  issuedDate?: string;
  expiryDate?: string;
  signed?: boolean;
}

export interface IEducationCredential {
  id: number;
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

export type ActionType =
  | { type: "SET_CREDENTIALS"; payload: SDK.Domain.Credential[] }
  | { type: "SET_PLUTO"; payload: SDK.Domain.Pluto }
  | { type: "SET_DID"; payload: SDK.Domain.DID }
  | { type: "SET_MNEMONICS"; payload: string[] }
  | { type: "SET_AGENT"; payload: SDK.Agent }
  | { type: "SET_ERROR"; payload: Err }
  | { type: "SET_WARN"; payload: Err }
  | { type: "SET_NEW_MESSAGE"; payload: SDK.Domain.Message[] }
  | { type: "SET_VERIFICATION"; payload: SDK.Domain.Credential }
  // | { type: 'SET_SUBMIT'; payload: VerifyStatus }
  // | { type: 'SET_DEVICE'; payload: DeviceInfo }
  | { type: "SET_LISTENER_STATE"; payload: boolean }
  | { type: "VERIFIED_VC"; payload: any }
  | { type: "SET_ENCRYPTED_DATA"; payload: string }
  | { type: "SET_LIST_PROCESSING"; payload: boolean }
  | { type: "LOADING_START" }
  | { type: "LOADING_END" };
