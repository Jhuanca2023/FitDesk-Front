//import { create } from "zustand";
//import { devtools } from "zustand/middleware";
//import { loggedInUserData, type Message, type User } from "@/modules/trainer/messages/data";

//interface ChatState {
  //  selectedUser: User | null;
    //conversations: User[];
    //messages: Message[];
    //setSelectedUser: (user: User) => void;
    //setConversations: (users: User[]) => void;
    //setMessages: (messages: Message[]) => void;
//}

//export const useChatStore = create<ChatState>()(
  //  devtools((set) => ({
    //    selectedUser: null,
      //  conversations: [], // Inicializa como un array vacío
        //messages: [], // Inicializa como un array vacío
        //setSelectedUser: (user) => set({ selectedUser: user }),
        //setConversations: (users) => set({ conversations: users }),
        //setMessages: (messages) => set({ messages }),
    //}))
//);