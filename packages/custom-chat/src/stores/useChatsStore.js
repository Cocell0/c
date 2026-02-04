import { defineStore } from "pinia";
import Dexie from "dexie";

export const useChatsStore = defineStore("chats", {
  state: () => ({
    systemChats: [
      {
        name: "Development",
        channel: "development",
        system: true,
        key: "development",
      },
      { name: "General", channel: "general", system: true, key: "general" },
      {
        name: "Living Room",
        channel: "living-room",
        system: true,
        key: "living-room",
      },
      { name: "Garden", channel: "garden", system: true, key: "garden" },
    ],
    userChats: [],
    chatMetadata: [],
  }),

  getters: {
    /**
     * Returns all chats sorted by last active time.
     * @returns {Array} An array of chats sorted by last active time.
     */
    allChats: (state) => {
      const metadataMap = (state.chatMetadata || []).reduce(
        (accumulator, entry) => {
          accumulator[entry.key] = entry.metadata || {};
          return accumulator;
        },
        {},
      );

      return [...state.systemChats, ...state.userChats]
        .map((chat) => ({
          ...chat,
          ...metadataMap[chat.key],
        }))
        .sort((firstChat, secondChat) => {
          // Sorting chats
          // Pinned first
          if (firstChat.pinned && !secondChat.pinned) return -1;
          if (!firstChat.pinned && secondChat.pinned) return 1;
          // Then sort by lastActive descending
          return (secondChat.lastActive || 0) - (firstChat.lastActive || 0);
        });
    },
  },

  actions: {
    /**
     * Initializes the database.
     * @returns {Promise<void>} A promise that resolves when the database is initialized.
     */
    async initializeDB() {
      this.db = new Dexie("CustomChatDBDevelopment");

      this.db
        .version(2)
        .stores({
          chats: "&key,name,channel",
          chatMetadata: "&key,metadata",
        })
        .upgrade(async (trans) => {
          const oldChats = await trans.table("chats").toArray();
          await trans.table("chats").clear();
          for (const chat of oldChats) {
            const { name, key, channel } = chat;
            if (name && key && channel) {
              await trans.table("chats").put({ name, key, channel });
            }
          }
        });

      await this.db.open();
      await this.loadUserChats();

      this.channel = new BroadcastChannel("custom-chat");

      this.channel.onmessage = (event) => {
        if (event?.data?.type === "sync") {
          this.loadUserChats();
        }
      };
    },

    /**
     * Loads the user's chats from the database.
     * @returns {Promise<void>} A promise that resolves when the chats are loaded.
     */
    async loadUserChats() {
      this.userChats = await this.db.chats.toArray();
      this.chatMetadata = await this.db.chatMetadata.toArray();
    },

    /**
     * Adds a new chat to the database.
     * @param {string} name The name of the chat.
     * @returns {Promise<Object>} A promise that resolves with the newly added chat object.
     */
    async addChat(name) {
      const chat = {
        name: name,
        channel: crypto.randomUUID(),
        key: crypto.randomUUID(),
      };
      await this.db.chats.put({ ...chat });
      await this.loadUserChats();

      this.channel.postMessage({ type: "sync" });
      return chat;
    },

    /**
     * Deletes a chat from the database.
     * @param {string} key The key of the chat to delete.
     * @returns {Promise<void>} A promise that resolves when the chat is deleted.
     */
    async deleteChat(key) {
      await this.db.chats.delete(key);

      this.channel.postMessage({ type: "sync" });
      await this.loadUserChats();
    },

    /**
     * Renames a chat in the database.
     * @param {string} key The key of the chat to rename.
     * @param {string} name The new name of the chat.
     * @returns {Promise<void>} A promise that resolves when the chat is renamed.
     */
    async renameChat(key, name) {
      const existingChat = await this.db.chats.get(key);
      if (!existingChat) return;

      await this.db.chats.put({ ...existingChat, name });
      await this.loadUserChats();
      this.channel.postMessage({ type: "sync" });
    },

    /**
     * Updates a chat's metadata in the database. Unsupported fields will be ignored.
     * @param {string} key The key of the chat's metadata to update.
     * @param {{ pinned?: boolean, lastActive?: number }} changes The new changes to apply to the chat's metadata.
     * @returns {Promise<void>} A promise that resolves when the chat's metadata is updated.
     */
    async updateMetadata(key, changes) {
      const allowedFields = ["pinned", "lastActive"];
      const validChanges = {};

      for (const field of allowedFields) {
        if (field in changes) validChanges[field] = changes[field];
      }

      if (Object.keys(validChanges).length === 0) return;

      // Using this verbose method instead of simply using `.update` is because
      // `.update` throws an error about the transaction already being finished
      const existingMetadata = (await this.db.chatMetadata.get(key)) || {
        key,
        metadata: {},
      };

      try {
        await this.db.chatMetadata.put({
          ...existingMetadata,
          metadata: {
            ...existingMetadata.metadata,
            ...validChanges,
          },
        });
        await this.loadUserChats();
      } catch (error) {
        console.error("Error updating chat:", error);
      }

      this.channel.postMessage({ type: "sync" });
    },
  },
});
