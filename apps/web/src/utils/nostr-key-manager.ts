// File: apps/web/src/utils/NostrKeyManager.ts

import { generatePrivateKey, getPublicKey } from "nostr-tools";

export class NostrKeyManager {
  private static STORAGE_KEY = "nostr_pubkey";

  static async getOrCreateKeyPair(): Promise<{
    secretKey: string;
    publicKey: string;
  }> {
    const storedPubKey = localStorage.getItem(NostrKeyManager.STORAGE_KEY);

    if (storedPubKey) {
      const secretKey = await this.retrieveSecretKey(storedPubKey);
      return { secretKey, publicKey: storedPubKey };
    }
    return this.createAndStoreKeyPair();
  }

  private static async createAndStoreKeyPair(): Promise<{
    secretKey: string;
    publicKey: string;
  }> {
    const secretKey = generatePrivateKey();
    const publicKey = getPublicKey(secretKey);

    await this.storeSecretKey(secretKey, publicKey);
    localStorage.setItem(NostrKeyManager.STORAGE_KEY, publicKey);

    return { secretKey, publicKey };
  }

  private static async storeSecretKey(
    secretKey: string,
    publicKey: string,
  ): Promise<void> {
    const encoder = new TextEncoder();
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: encoder.encode("nostr-key-challenge"),
        rp: { name: "Nostr Connect App" },
        user: {
          id: encoder.encode(publicKey),
          name: "Nostr User",
          displayName: "Nostr User",
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }],
      },
    });

    if (credential && credential.type === "public-key") {
      const pkCred = credential as PublicKeyCredential;
      const rawId = Array.from(new Uint8Array(pkCred.rawId));
      localStorage.setItem(
        `nostr_cred_${publicKey}`,
        JSON.stringify({ rawId, secretKey }),
      );
    } else {
      throw new Error("Failed to create credential");
    }
  }

  private static async retrieveSecretKey(publicKey: string): Promise<string> {
    const storedCred = localStorage.getItem(`nostr_cred_${publicKey}`);
    if (!storedCred) throw new Error("No stored credential found");

    const { rawId, secretKey } = JSON.parse(storedCred);
    const encoder = new TextEncoder();

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: encoder.encode("nostr-key-challenge"),
        allowCredentials: [
          {
            id: new Uint8Array(rawId),
            type: "public-key",
          },
        ],
      },
    });

    if (assertion && assertion.type === "public-key") {
      return secretKey;
    }
    throw new Error("Failed to retrieve credential");
  }
}
