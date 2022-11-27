<script setup>
import imgUrl from './assets/favicon.png';
</script>

<template>
    <header>
        <h1>
            <img :src="imgUrl" class="logo" />
            <router-link class="muted" :to="'/'">Dashboard</router-link>
        </h1>
    </header>
    <pre v-if="error">⚠️ {{ error }}</pre>
    <router-view :instances="instances" :gameservers="gameservers" :error="error"></router-view>
    <p>&copy; 2022 <a href="//bluedragonmc.com">BlueDragonMC</a>. Made with ❤️ and <a href="//vuejs.org">Vue 3</a>.</p>
</template>

<script>
export default {
    created() {
        let socket = new WebSocket("ws://localhost:8080/");
        this.ws = socket;
        socket.onopen = event => {
            console.log("Socket opened", event);
            this.requestFullUpdate();
        };
        socket.onclose = async event => {
            this.error = "🔌 Socket closed: status code " + event.code;
        }
        socket.onmessage = event => {
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
                case "update":
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
                        default:
                            console.warn("Unknown resource type", data.resource);
                            break;
                    }
                    break;
                default:
                    console.warn("Unknown message type", data.type);
                    break;
            }
        };
    },
    methods: {
        requestFullUpdate() {
            this.ws.send(JSON.stringify({ request: 'getGameServers' }));
            this.ws.send(JSON.stringify({ request: 'getInstances' }));
            this.ws.send(JSON.stringify({ request: 'getGameTypes' }));
        }
    },
    data() {
        return {
            instances: {},
            gameservers: [],
            ws: undefined,
            error: undefined,
        }
    }
}
</script>

<style scoped>
img.logo {
    height: 1em;
    vertical-align: text-bottom;
}
</style>