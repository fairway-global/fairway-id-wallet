import { generateSeedAndMnemonics, startAgentService } from "./agent";
import { CryptoUtils } from "../utils/crypto";
import config from "../config";
import SDK from "@hyperledger/identus-edge-agent-sdk";
import * as bip39 from "bip39";
import { logger } from "../utils/logger";

export class WalletService {
  constructor(private secretKey: string = config.SECRET_KEY) {}

  async generateSeedPhrase(
    password: string
  ): Promise<{ mnemonics: string; encryptedData: Record<string, string> }> {
    logger.log("WalletService", "Generating seed phrase");
    if (!password) throw new Error("Password is required");

    const { mnemonics, seed } = await generateSeedAndMnemonics();
    const mnemonicsString = mnemonics.join(" ");
    const seedHex = seed.value.toString("hex");

    const encryptedData = {
      encryptedSeed: CryptoUtils.encrypt(seedHex, this.secretKey),
      encryptedMnemonics: CryptoUtils.encrypt(mnemonicsString, this.secretKey),
      encryptedPassword: CryptoUtils.encrypt(password, this.secretKey),
    };

    logger.log("WalletService", "Seed phrase generated successfully");
    return { mnemonics: mnemonicsString, encryptedData };
  }

  async recoverWallet(
    mnemonics: string,
    password: string,
    pluto: SDK.Pluto
  ): Promise<{ encryptedData: Record<string, string>; agent: SDK.Agent }> {
    logger.log("WalletService", "Recovering wallet");
    if (!password || password.length < 8)
      throw new Error("Password must be at least 8 characters");
    const mnemonicArray = mnemonics.split(" ");
    if (mnemonicArray.length !== 12 || !bip39.validateMnemonic(mnemonics))
      throw new Error("Invalid mnemonic phrase");

    const seedBuffer = bip39.mnemonicToSeedSync(mnemonics).slice(0, 64);
    const seed = { value: seedBuffer };
    const encryptedData = {
      encryptedSeed: CryptoUtils.encrypt(
        seedBuffer.toString("hex"),
        this.secretKey
      ),
      encryptedMnemonics: CryptoUtils.encrypt(mnemonics, this.secretKey),
      encryptedPassword: CryptoUtils.encrypt(password, this.secretKey),
    };

    const agent = await startAgentService(pluto, seed);
    logger.log("WalletService", "Wallet recovered successfully");
    return { encryptedData, agent };
  }

  verifyPassword(encryptedPassword: string, password: string): boolean {
    try {
      const decrypted = CryptoUtils.decrypt(encryptedPassword, this.secretKey);
      return decrypted === password;
    } catch {
      return false;
    }
  }
}
