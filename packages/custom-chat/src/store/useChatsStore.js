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

      this.db
        .version(2)
        .stores({
          chats: "&key,name,channel",
          lastActive: "&key,timestamp",
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
