<script setup>
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import imgUrl from './assets/favicon_hq.png';
</script>

<template>
    <header>
        <h1 class="logo-header">
            <img :src="imgUrl" class="logo" />
            <router-link class="muted" :to="'/'">Dashboard</router-link>
            <span v-if="$route.path != '/'" v-for="element in path">
                <ic :icon="faAnglesRight" class="breadcrum" />
                <router-link class="muted" :to="element.path">{{ element.name }}</router-link>
            </span>
        </h1>
    </header>
    <div class="alerts">
        <pre v-if="error" class="error">⚠️ {{ error }}</pre>
        <pre v-if="connecting" class="info">🔌 Connecting...</pre>
        <pre v-if="reconnecting" class="warning">🔌 Reconnecting...</pre>
    </div>
    <router-view></router-view>
    <p class="footer">&copy; 2022 <a href="//bluedragonmc.com">BlueDragonMC</a> &middot; Made with ❤️ and <a
            href="//vuejs.org">Vue 3</a>.</p>
</template>

<script>
import { faCircleExclamation, faInfoCircle, faLayerGroup, faPersonWalking, faServer, faWarning } from '@fortawesome/free-solid-svg-icons';
import { mapWritableState } from 'pinia';
import { useStore } from './stores/store';

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
                    this.logs.info("Updated all game servers", `Retrieved ${this.gameservers.length} servers.`);
                    break;
                case "instances":
                    for (const instance of data.instances) {
                        this.instances[instance.id] = instance;
                    }
                    this.logs.info("Updated all instances", `Retrieved ${Object.keys(this.instances).length} instances.`);
                    break;
                case "gameTypes":
                    this.gameTypes = data.types;
                    this.logs.info("Updated all game types", `Retrieved ${this.gameTypes.length} game types.`);
                    break;
                case "players":
                    this.players = data.players;
                    this.logs.info("Updated all players");
                    this.requestUsernames();
                    break;
                case "playerInfo":
                    this.usernames[data.uuid] = data.username;
                    console.log("Updated username for", data.username);
                    break;
                case "update":
                    this.handleUpdate(data);
                    this.requestUsernames();
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
                            this.logs.log("gs", `Added new game server: ${data.id}`);
                            break;
                        case "remove":
                            this.gameservers = this.gameservers.filter(el => {
                                return el.name != data.id;
                            });
                            this.logs.log("gs", `Removed game server: ${data.id}`);
                            break;
                        default:
                            this.logs.warn(`Dashboard error: unknown action: ${data.action}`);
                            break;
                    }
                    break;
                case "instance":
                    // Update an instance
                    switch (data.action) {
                        case "add":
                            this.instances[data.id] = data.updated;
                            for (const server of this.gameservers) {
                                if (data.updated.gameServer == server.name && !server.instances.includes(data.id)) {
                                    server.instances.push(data.id);
                                }
                            }
                            this.logs.log("instance", `New instance: ${data.id.substring(0, 8)}`, data.id);
                            break;
                        case "remove":
                            delete this.instances[data.id];
                            for (const server of this.gameservers) {
                                server.instances = server.instances.filter(el => el != data.id);
                            }
                            this.logs.log("instance", `Instance removed: ${data.id.substring(0, 8)}`, data.id);
                            break;
                        case "update":
                            this.instances[data.id] = data.updated;
                            this.logs.log("instance", `Instance updated: ${data.id.substring(0, 8)}`, data.id);
                            break;
                        default:
                            this.logs.warn(`Dashboard error: unknown action: ${data.action}`);
                            break;
                    }
                    break;
                case "player":
                    let instance = this.getInstance(data.id);
                    switch (data.action) {
                        case "logout":
                            this.players[instance] = this.players[instance].filter(player => player != data.id); // Remove from their instance
                            this.logs.log("player", `Player logged out: ${this.usernames[data.id] ?? data.id}`);
                            break;
                        case "transfer":
                            if (this.players[instance]) { // The field may not exist if the player just logged in without an instance to transfer from
                                this.players[instance] = this.players[instance].filter(player => player != data.id); // Remove from old instance
                            }
                            if (!this.players[data.updated.instance]) {
                                this.players[data.updated.instance] = []; // Create a new entry in the map if necessary
                            }
                            this.players[data.updated.instance].push(data.id); // Add to new instance
                            if (instance !== undefined) {
                                if (instance !== data.updated.instance)
                                    this.logs.log("player", `Player ${this.usernames[data.id] ?? data.id} switched from ${instance} to ${data.updated.instance}.`);
                            } else {
                                this.logs.log("player", `Player ${this.usernames[data.id] ?? data.id} logged in to ${data.updated.instance}.`);
                            }
                            break;
                        default:
                            this.logs.warn(`Dashboard error: unknown action: ${data.action}`);
                            break;
                    }
                    break;
                default:
                    this.logs.warn(`Dashboard error: unknown resource type: ${data.resource}`);
                    break;
            }
        },
        getInstance(player) {
            return Object.keys(this.players).find((instance) => this.players[instance].includes(player));
        },
        onOpen(event) {
            this.logs.info("Connection opened.", event.target.url);
            this.requestFullUpdate();
            this.error = undefined;
            this.connecting = false;
            this.reconnecting = false;
            this.connectDelay = 1000;
        },
        onClose(event) {
            this.logs.error(`Connection closed. (Status code: ${event.code})`);
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
                this.logs.warn(`Reconnecting in ${Math.round(this.connectDelay / 1000)} seconds...`);
            }, this.connectDelay);
            if (this.connectDelay < 30000) {
                this.connectDelay *= 1.5;
            }
        },
        openConnection() {
            const protocol = location.protocol === "https:" ? "wss" : "ws";
            let socket = new WebSocket(`${protocol}://${location.host}/ws`);
            this.ws = socket;
            socket.onopen = this.onOpen;
            socket.onclose = this.onClose;
            socket.onmessage = this.onMessageReceived;
        }
    },
    data() {
        return {
            logs: {
                info: (msg, extra) => this.logs.log("info", msg, extra),
                warn: (msg, extra) => this.logs.log("warn", msg, extra),
                error: (msg, extra) => this.logs.log("error", msg, extra),
                log: (type, msg, extra) => {
                    this.events.push({
                        type: this.logs.types[type],
                        message: msg,
                        extra: extra,
                        time: new Date().toLocaleTimeString(),
                        id: Math.random()
                    });
                    if (this.events.length > 50) {
                        this.events.shift();
                    }
                },
                types: {
                    "info": faInfoCircle,
                    "warn": faWarning,
                    "error": faCircleExclamation,
                    "player": faPersonWalking,
                    "instance": faLayerGroup,
                    "gs": faServer,
                },
            },
        };
    },
    computed: {
        path() {
            const path = this.$route.path;
            console.log(this.$route);
            if (path.startsWith("/server/")) {
                return [{ name: "Game Servers", path: "/gameservers" }, { name: this.$route.params.name, path: this.$route.path }]
            } else if (path.startsWith("/state/")) {
                return [{ name: "Game Servers", path: "/gameservers" }, { name: this.$route.params.state, path: this.$route.path }]
            } else if (path.startsWith("/instance/")) {
                const gameServer = this.gameservers.find((it) => it.instances.includes(this.$route.params.name));
                if (gameServer) {
                    return [
                        { name: "Game Servers", path: "/gameservers" },
                        { name: gameServer.name, path: "/server/" + gameServer.name },
                        { name: this.$route.params.name.substring(0, 8), path: this.$route.path }];
                } else {
                    return [
                        { name: "View Instance", path: "/" },
                        { name: this.$route.params.name.substring(0, 8), path: this.$route.path }];
                }
            } else if (this.$route.matched[0].path == "/game/:name") {
                return [
                    { name: "Game Servers", path: "/gameservers" },
                    { name: this.$route.params.name, path: this.$route.path }
                ]
            } else if (this.$route.matched[0].path == "/game/:name/:mapName") {
                return [
                    { name: "Game Servers", path: "/gameservers" },
                    { name: this.$route.params.name, path: "/game/" + this.$route.params.name },
                    { name: this.$route.params.mapName, path: this.$route.path }
                ]
            } else if (path.startsWith("/logs/")) {
                return [
                    { name: "Game Servers", path: "/gameservers" },
                    { name: this.$route.params.pod, path: "/server/" + this.$route.params.pod },
                    { name: "Logs", path: this.$route.path }
                ]
            }
            return [this.$route];
        },
        ...mapWritableState(useStore, ["ws", "error", "connectDelay", "reconnecting", "connecting", "gameservers", "instances", "players", "usernames", "events"]),
    },
};
</script>

<style scoped>
img.logo {
    height: 1em;
    vertical-align: text-bottom;
}

.footer {
    margin-top: 15px;
}

h1.logo-header {
    background: var(--accent-background);
    border-radius: 10px;
    padding: 0.2em;
    margin-bottom: 10px;
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

.breadcrum {
    font-size: medium;
    margin: 0 0.5em;
}
</style>