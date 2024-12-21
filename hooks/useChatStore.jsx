import {create} from 'zustand'
import {combine, createJSONStorage, persist} from 'zustand/middleware'

const MAX_MESSAGES_LIMIT = 100 // Limit number of stored messages

const useChatStore = create(persist(combine({
    selectedGroupID: null, selectedChannel: null, inputMessage: "", messagesList: [],
}, (set, get) => ({
    setSelectedGroupID: (newlySelectedGroupID) => {
        if (newlySelectedGroupID === null) {
            // Clear both from localStorage directly
            localStorage.removeItem('chat-storage');
        }

        if (!!!get().selectedGroupID || newlySelectedGroupID !== get().selectedGroupID) {
            set((state) => ({
                selectedGroupID: newlySelectedGroupID, selectedChannel: null, inputMessage: "", messagesList: [],
            }));
        }
    },

    setSelectedChannel: (newChannel) => {
        set((state) => ({
            selectedChannel: newChannel, // Reset messages when changing channel
            inputMessage: "", messagesList: [],
        }));
    },

    setInputMessage: (newMessage) => {
        set((state) => ({
            inputMessage: newMessage,
        }));
    },

    updateMessage: (message_id, content) => {
        set((state) => ({
            messagesList: state.messagesList.map((message) => message.message_id === message_id ? {
                ...message, content: content
            } : message),
        }));
    },

    deleteMessage: (messageId) => {
        set((state) => ({
            messagesList: state.messagesList.filter((message) => message.message_id !== messageId),
        }));
    },

    addToMessagesList: (newMessage) => {
        set((state) => {
            // Limit messages to prevent memory bloat
            const updatedMessages = [...state.messagesList, ...newMessage].slice(-MAX_MESSAGES_LIMIT);

            return {
                messagesList: updatedMessages,
            };
        });
    },

    clearMessages: () => {
        set((state) => ({
            messagesList: [],
        }));
    },
})), {
    name: "chat-storage", // unique name
    storage: createJSONStorage(() => localStorage), partialize: (state) => ({
        // Only persist certain parts of the state
        selectedGroupID: state.selectedGroupID, selectedChannel: state.selectedChannel,
    }),
}));

export default useChatStore;
