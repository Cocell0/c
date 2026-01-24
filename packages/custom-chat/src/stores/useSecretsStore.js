import { defineStore } from "pinia";

/**
 * Secret's store
 *
 * Contains the private and public keys used for encryption and decryption
 * of the chat object when sharing them.
 * @module useSecretsStore
 */
export const useSecretsStore = defineStore("secrets", {
  state: () => ({
    publicKey: "PUBLIC_1_null_PUBLIC_END",
    privateKey: "PRIVATE_1_null_PRIVATE_END",
  }),
});
