import { defineStore } from "pinia";

export const useStore = defineStore('store', {
    state: () => ({
        ws: undefined,
        error: undefined,
        connectDelay: 1000,
        reconnecting: false,
        connecting: true,
        gameservers: [],
        instances: {},
        players: {},
        usernames: {},
        events: [],
    }),
});