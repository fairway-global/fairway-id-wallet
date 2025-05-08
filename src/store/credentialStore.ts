import { create } from "zustand";
import { useAgentStore } from "./agentStore";
import { logger } from "@/utils/logger";

export interface Credential {
  id: string;
  type: string;
  issuer: string;
  issuanceDate: string;
  expirationDate?: string;
  claims: Record<string, any>;
  raw: any;
}

interface CredentialState {
  credentials: Credential[];
  fetchCredentials: () => Promise<Credential[]>;
}

export const useCredentialStore = create<CredentialState>((set) => ({
  credentials: [],

  async fetchCredentials() {
    logger.log("Credentials", "Fetching credentials");
    try {
      const agent = useAgentStore.getState().agent;
      if (!agent) throw new Error("Agent not initialized");
      const storedCredentials = await agent.pluto.getAllCredentials();
      const credentials: Credential[] = storedCredentials.map((vc: any) => {
        let claims: Record<string, any> = {};
        if (vc.claims && Array.isArray(vc.claims) && vc.claims.length > 0) {
          const claimObject = vc.claims[0];
          if (claimObject && typeof claimObject === "object") {
            Object.entries(claimObject).forEach(([key, disclosure]) => {
              if (disclosure && disclosure.value) {
                claims[key] = disclosure.value;
              }
            });
          }
        }
        const core = vc.core || {};
        const properties = vc.properties
          ? Object.fromEntries(vc.properties)
          : {};
        return {
          id: vc.id || vc.uuid || properties.jti || crypto.randomUUID(),
          type: vc.credentialType || "Unknown",
          issuer: properties.iss || core.iss || "Unknown",
          issuanceDate: properties.iat
            ? new Date(properties.iat * 1000).toISOString()
            : new Date().toISOString(),
          expirationDate: properties.exp
            ? new Date(properties.exp * 1000).toISOString()
            : undefined,
          claims,
          raw: vc,
        };
      });
      set({ credentials });
      return credentials;
    } catch (err) {
      logger.error("Credentials", "Failed to fetch credentials", err);
      throw err;
    }
  },
}));
