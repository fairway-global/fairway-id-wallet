import * as bip39 from "bip39";
import SDK from "@hyperledger/identus-edge-agent-sdk";
import { CryptoUtils } from "@/utils/crypto";

export class WalletService {
  private apollo: SDK.Apollo;

  constructor(apollo: SDK.Apollo) {
    this.apollo = apollo;
  }

  generateSeedAndMnemonics(): { mnemonics: string[]; seed: SDK.Domain.Seed } {
    const { seed, mnemonics } = this.apollo.createRandomSeed();
    return { mnemonics, seed };
  }

  generateSeedPhrase(password: string): {
    encryptedSeed: string;
    encryptedMnemonics: string;
    encryptedPassword: string;
  } {
    const { mnemonics, seed } = this.generateSeedAndMnemonics();
    const seedBuffer = seed.value;
    const encryptedData = {
      encryptedSeed: CryptoUtils.encrypt(seedBuffer.toString("hex")),
      encryptedMnemonics: CryptoUtils.encrypt(mnemonics.join(" ")),
      encryptedPassword: CryptoUtils.encrypt(password),
    };
    return encryptedData;
  }

  recoverWallet(
    mnemonics: string,
    password: string
  ): {
    encryptedSeed: string;
    encryptedMnemonics: string;
    encryptedPassword: string;
    seed: SDK.Domain.Seed;
  } {
    const seedBuffer = bip39.mnemonicToSeedSync(mnemonics).slice(0, 64);
    const seed = { value: seedBuffer };
    const encryptedData = {
      encryptedSeed: CryptoUtils.encrypt(seedBuffer.toString("hex")),
      encryptedMnemonics: CryptoUtils.encrypt(mnemonics),
      encryptedPassword: CryptoUtils.encrypt(password),
    };
    return { ...encryptedData, seed };
  }

  verifyPassword(encryptedPassword: string, password: string): boolean {
    try {
      const decrypted = CryptoUtils.decrypt(encryptedPassword);
      return decrypted === password;
    } catch {
      return false;
    }
  }
}
