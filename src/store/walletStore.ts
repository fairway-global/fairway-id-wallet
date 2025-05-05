import { create } from "zustand";
import { logger } from "@/utils/logger";
import { useAgentStore } from "./agentStore";
import { WalletService } from "../services/wallet";
import { apollo } from "../services/pluto";
import SDK from "@hyperledger/identus-edge-agent-sdk";
import { config } from "../config";

interface WalletState {
  hasWallet: boolean;
  encryptedPassword: string | null;
  encryptedMnemonics: string | null;
  encryptedSeed: string | null;
  checkingWallet: boolean;
}

interface WalletActions {
  checkWalletExists: () => Promise<boolean>;
  generateSeedPhrase: (password: string) => Promise<string>;
  recoverWallet: (mnemonics: string, password: string) => Promise<void>;
  signIn: (password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  resetWallet: () => Promise<boolean>;
  clearSeedData: () => void;
  backupWallet: () => Promise<SDK.Domain.Backup.Schema>;
  restoreWallet: (backup: SDK.Domain.Backup.Schema) => Promise<void>;
}

const walletService = new WalletService(apollo);

export const useWalletStore = create<WalletState & WalletActions>(
  (set, get) => ({
    hasWallet: false,
    encryptedPassword: null,
    encryptedMnemonics: null,
    encryptedSeed: null,
    checkingWallet: true,

    async checkWalletExists() {
      logger.log("Wallet", "Checking if wallet exists");
      try {
        const localStorageData = localStorage.getItem(
          config.LOCAL_STORAGE_NAME
        );
        const parsedData = localStorageData
          ? JSON.parse(localStorageData)
          : null;
        const walletExists = parsedData?.encryptedSeed;
        set({ hasWallet: walletExists, checkingWallet: false });
        return walletExists;
      } catch (err) {
        logger.error("Wallet", "Error checking wallet existence", err);
        set({ checkingWallet: false, hasWallet: false });
        return false;
      }
    },

    async generateSeedPhrase(password) {
      logger.log("Wallet", "Generating seed phrase");
      try {
        if (!password) throw new Error("Password is required");
        const { encryptedSeed, encryptedMnemonics, encryptedPassword } =
          walletService.generateSeedPhrase(password);
        set({
          encryptedSeed,
          encryptedMnemonics,
          encryptedPassword,
          hasWallet: true,
        });
        localStorage.setItem(
          config.LOCAL_STORAGE_NAME,
          JSON.stringify({
            encryptedSeed,
            encryptedMnemonics,
            encryptedPassword,
          })
        );
        return encryptedMnemonics;
      } catch (err) {
        logger.error("Wallet", "Failed to generate seed phrase", err);
        throw err;
      }
    },

    async recoverWallet(mnemonics, password) {
      logger.log("Wallet", "Recovering wallet");
      try {
        if (!password || password.length < 8)
          throw new Error("Invalid password");
        const { encryptedSeed, encryptedMnemonics, encryptedPassword, seed } =
          walletService.recoverWallet(mnemonics, password);
        set({
          hasWallet: true,
          encryptedPassword,
          encryptedMnemonics,
          encryptedSeed,
        });
        await localStorage.setItem(
          config.LOCAL_STORAGE_NAME,
          JSON.stringify({
            encryptedSeed,
            encryptedMnemonics,
            encryptedPassword,
          })
        );
        await useAgentStore.getState().startAgent(true);
      } catch (err) {
        logger.error("Wallet", "Failed to recover wallet", err);
        throw err;
      }
    },

    async signIn(password) {
      logger.log("Wallet", "Signing in");
      try {
        const { encryptedPassword } = get();
        if (!encryptedPassword) throw new Error("No wallet found");
        const isValid = walletService.verifyPassword(
          encryptedPassword,
          password
        );
        if (!isValid) throw new Error("Incorrect password");
        await useAgentStore.getState().startAgent();
        return true;
      } catch (err) {
        logger.error("Wallet", "Sign-in failed", err);
        return false;
      }
    },

    async signOut() {
      logger.log("Wallet", "Signing out");
      try {
        await useAgentStore.getState().stopAgent();
      } catch (err) {
        logger.error("Wallet", "Failed to sign out", err);
      }
    },

    async resetWallet() {
      logger.log("Wallet", "Resetting wallet");
      try {
        await useAgentStore.getState().stopAgent();
        set({
          hasWallet: false,
          encryptedPassword: null,
          encryptedMnemonics: null,
          encryptedSeed: null,
        });
        localStorage.removeItem("fairway-wallet-storage");
        return true;
      } catch (err) {
        logger.error("Wallet", "Failed to reset wallet", err);
        return false;
      }
    },

    clearSeedData() {
      set({ encryptedSeed: null, encryptedMnemonics: null });
    },

    async backupWallet() {
      logger.log("Agent", "Backing up wallet");
      try {
        const agent = useAgentStore.getState().agent;
        if (!agent) throw new Error("Agent not initialized");
        return await agent.pluto.backup("0.0.1");
      } catch (err) {
        logger.error("Agent", "Failed to backup wallet", err);
        throw err;
      }
    },

    async restoreWallet(backup) {
      logger.log("Agent", "Restoring wallet");
      try {
        const agent = useAgentStore.getState().agent;
        if (!agent) throw new Error("Agent not initialized");
        await agent.pluto.restore(backup);
      } catch (err) {
        logger.error("Agent", "Failed to restore wallet", err);
        throw err;
      }
    },
  })
);
