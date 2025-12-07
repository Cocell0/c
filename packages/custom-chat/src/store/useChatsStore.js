import { defineStore } from "pinia";
import Dexie from "dexie";

export const useChatsStore = defineStore("chats", {
  state: () => ({
    globalChats: [
      { name: "Development", id: "development" },
      { name: "General", id: "general" },
      { name: "Living Room", id: "living-room" },
      { name: "Garden", id: "garden" },
    ],
    savedChats: [],
  }),

  actions: {
    initializeDB() {
      this.db = new Dexie("CustomChatDB");
      this.db.version(1).stores({
        chats: "id,name,lastActive",
      });
      this.loadSavedChats();
    },

    async loadSavedChats() {
      this.savedChats = await this.db.chats.toArray();
    },

    async addChat(chat) {
      await this.db.chats.put({ ...chat, lastActive: Date.now() });
      this.loadSavedChats();
    },

    async updateChat(chat) {
      await this.db.chats.put({ ...chat, lastActive: Date.now() });
      this.loadSavedChats();
    },

    async deleteChat(id) {
      await this.db.chats.delete(id);
      this.loadSavedChats();
    },
  },
});

