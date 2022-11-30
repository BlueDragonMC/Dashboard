<script setup>
import imgUrl from './assets/favicon.png';
</script>

<template>
    <header>
        <h1 class="logo-header">
            <img :src="imgUrl" class="logo" />
            <router-link class="muted" :to="'/'">Dashboard</router-link>
        </h1>
    </header>
    <div class="alerts">
        <pre v-if="error" class="error">⚠️ {{ error }}</pre>
        <pre v-if="connecting" class="info">🔌 Connecting...</pre>
        <pre v-if="reconnecting" class="warning">🔌 Reconnecting...</pre>
    </div>
    <router-view :instances="instances" :gameservers="gameservers" :error="error" :players="players"
        :usernames="usernames"></router-view>
    <p class="footer">&copy; 2022 <a href="//bluedragonmc.com">BlueDragonMC</a> &middot; Made with ❤️ and <a
            href="//vuejs.org">Vue 3</a>.</p>
</template>

<script>
export default {
    created() {
        this.openConnection();
    },
    methods: {
        requestFullUpdate() {
            this.ws.send(JSON.stringify({ request: 'getGameServers' }));
            this.ws.send(JSON.stringify({ request: 'getInstances' }));
            this.ws.send(JSON.stringify({ request: 'getGameTypes' }));
            this.ws.send(JSON.stringify({ request: 'getPlayers' }));
        },
        requestUsernames() {
            for (const playerList of Object.values(this.players)) {
                for (const player of playerList) {
                    if (!this.usernames[player]) {
                        this.ws.send(JSON.stringify({ request: 'getUsername', uuid: player }));
                    }
                }
            }
        },
        onMessageReceived(event) {
            this.reconnecting = false;
            let data = JSON.parse(event.data);
            console.log("Message received", data);
            switch (data.type) {
                case "gameServers":
                    this.gameservers = data.gameServers;
                    console.log("Updated all game servers");
                    break;
                case "instances":
                    for (const instance of data.instances) {
                        this.instances[instance.id] = instance;
                    }
                    console.log("Updated all instances");
                    break;
                case "gameTypes":
                    this.gameTypes = data.gameTypes;
                    console.log("Updated all game types");
                    break;
                case "players":
                    this.players = data.players;
                    console.log("Updated all players");
                    this.requestUsernames();
                    break;
                case "playerInfo":
                    this.usernames[data.uuid] = data.username;
                    console.log("Updated username for", data.username);
                    break;
                case "update":
                    this.handleUpdate(data);
                    break;
                default:
                    console.warn("Unknown message type", data.type);
                    break;
            }
        },
        handleUpdate(data) {
            switch (data.resource) {
                case "gameServer":
                    // Updating a game server
                    switch (data.action) {
                        case "add": // Adding a new game server
                            this.gameservers.push(data.updated);
                            console.log("Added game server", data.id);
                            break;
                        case "remove":
                            this.gameservers = this.gameservers.filter(el => {
                                return el.name != data.id;
                            });
                            console.log("Removed game server", data.id);
                            break;
                        default:
                            console.warn("Unknown action", data.action);
                            break;
                    }
                    break;
                case "instance":
                    // Update an instance
                    switch (data.action) {
                        case "add":
                            this.instances[data.id] = data.updated;
                            for (const server of this.gameservers) {
                                if (data.updated.gameServer == server.name) {
                                    server.instances.push(data.id);
                                }
                            }
                            console.log("Added new instance", data.id);
                            break;
                        case "remove":
                            delete this.instances[data.id];
                            for (const server of this.gameservers) {
                                server.instances = server.instances.filter(el => el != data.id);
                            }
                            console.log("Removed instance", data.id)
                            break;
                        case "update":
                            this.instances[data.id] = data.updated;
                            console.log("Updated instance", data.id);
                            break;
                        default:
                            console.warn("Unknown action", data.action);
                            break;
                    }
                    break;
                case "player":
                    let instance = this.getInstance(data.id);
                    switch (data.action) {
                        case "logout":
                            this.players[instance] = this.players[instance].filter(player => player != data.id); // Remove from their instance
                            break;
                        case "transfer":
                            if (this.players[instance]) { // The field may not exist if the player just logged in without an instance to transfer from
                                this.players[instance] = this.players[instance].filter(player => player != data.id); // Remove from old instance
                            }
                            if (!this.players[data.updated.instance]) {
                                this.players[data.updated.instance] = []; // Create a new entry in the map if necessary
                            }
                            this.players[data.updated.instance].push(data.id); // Add to new instance
                            break;
                        default:
                            console.warn("Unknown action", data.action);
                            break;
                    }
                    break;
                default:
                    console.warn("Unknown resource type", data.resource);
                    break;
            }
        },
        getInstance(player) {
            return Object.keys(this.players).find((instance) => this.players[instance].includes(player));
        },
        onOpen(event) {
            console.log("Socket opened", event);
            this.requestFullUpdate();
            this.error = undefined;
            this.connecting = false;
            this.reconnecting = false;
            this.connectDelay = 1000;
        },
        onClose(event) {
            this.connecting = false;
            setTimeout(() => {
                if (this.reconnecting) {
                    this.reconnecting = false;
                    this.error = "Failed to reconnect: status code " + event.code;
                }
            }, 1000);
            this.error = "Socket closed: status code " + event.code;
            setTimeout(() => {
                this.openConnection();
                this.reconnecting = true;
            }, this.connectDelay);
            this.connectDelay *= 1.5;
        },
        openConnection() {
            let socket = new WebSocket("ws://localhost:8080/");
            this.ws = socket;
            socket.onopen = this.onOpen;
            socket.onclose = this.onClose;
            socket.onmessage = this.onMessageReceived;
        },
    },
    data() {
        return {
            instances: {},
            gameservers: [],
            players: {},
            usernames: {},
            ws: undefined,
            error: undefined,
            connectDelay: 1000,
            reconnecting: false,
            connecting: true,
        }
    }
}
</script>

<style scoped>
img.logo {
    height: 1em;
    vertical-align: text-bottom;
}

.footer {
    margin-top: 40px;
}

h1.logo-header {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 0.2em;
    margin-bottom: 10px;
}

@media(prefers-color-scheme: light) {
    h1.logo-header {
        background: rgba(0, 0, 0, 0.1);
    }
}

.alerts pre {
    border-radius: 10px;
    font-weight: bold;
    padding: 15px;
    margin-bottom: 10px;
    transition: height 0.5s ease-in-out;
}

.alerts pre.info {
    background: rgba(0, 153, 255, 0.3);
}

.alerts pre.error {
    background: rgba(248, 22, 22, 0.3);
}

.alerts pre.warning {
    background: rgba(255, 217, 0, 0.3);
}
</style>