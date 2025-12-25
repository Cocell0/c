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
    allChats: (state) => {
      const lastActiveMap =
        state.lastActive?.reduce((acc, entry) => {
          acc[entry.key] = entry.timestamp;
          return acc;
        }, {}) || {};

      return [...state.systemChats, ...state.userChats].sort(
        (a, b) => (lastActiveMap[b.key] || 0) - (lastActiveMap[a.key] || 0),
      );
    },
  },

  actions: {
    async initializeDB() {
      this.db = new Dexie("CustomChatDB");
      this.db.version(1).stores({
        chats: "&key,name,channel",
        lastActive: "&key,timestamp",
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
