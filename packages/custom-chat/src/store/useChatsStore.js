import { defineStore } from "pinia";

export const useChatsStore = defineStore("chats", {
  state: () => ({
    globalChats: [
      {
        name: "Development",
        id: "development",
      },
      {
        name: "General",
        id: "general",
      },
      {
        name: "Living Room",
        id: "living-room",
      },
      {
        name: "Garden",
        id: "garden",
      },
    ],
    savedChats: [],
  }),
});