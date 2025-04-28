import * as bip39 from "bip39";
import SDK from "@hyperledger/identus-edge-agent-sdk";

export function recoverSeedFromMnemonics(mnemonics: string[]): SDK.Domain.Seed {
  if (mnemonics.length !== 12) throw new Error("Invalid mnemonic length");
  const mnemonicPhrase = mnemonics.join(" ");
  if (!bip39.validateMnemonic(mnemonicPhrase))
    throw new Error("Invalid mnemonic");
  const seedBuffer = bip39.mnemonicToSeedSync(mnemonicPhrase);
  return { value: seedBuffer.slice(0, 64) };
}
