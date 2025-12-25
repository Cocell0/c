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
  }),

  getters: {
    allChats: (state) =>
      [
        ...state.systemChats.map((chat) => ({ ...chat, timestamp: 0 })),
        ...state.userChats,
      ].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)),
  },

  actions: {
    async initializeDB() {
      this.db = new Dexie("CustomChatDB");
      this.db.version(1).stores({
        chats: "++id,name,channel,key",
        lastActive: "++id,key,timestamp",
      });
      await this.loadUserChats();
    },

    async loadUserChats() {
      this.userChats = await this.db.chats.toArray();
    },

    async addChat(name) {
      const chat = {
        name: name,
        channel: crypto.randomUUID(),
        key: crypto.randomUUID(),
      };
      await this.db.chats.put({ ...chat });
      await this.loadUserChats();
    },

    // async updateChat(chat) {
    //   await this.db.chats.put({ ...chat });
    //   await this.loadUserChats();
    // },

    // async deleteChat(key) {
    //   await this.db.chats.delete(key);
    //   await this.loadUserChats();
    // },
  },
});
