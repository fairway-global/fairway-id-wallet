import sjcl from "sjcl";
import { config } from "../config";

export class CryptoUtils {
  static encrypt(data: string): string {
    try {
      // FIXME: check if this works
      return JSON.stringify(sjcl.encrypt(config.SECRET_KEY, data));
    } catch (error) {
      throw new Error(`Encryption failed: ${error?.message}`);
    }
  }

  static decrypt(data: string): string {
    try {
      return sjcl.decrypt(config.SECRET_KEY, data);
    } catch (error) {
      throw new Error(`Decryption failed: ${error?.message}`);
    }
  }
}
