import { createApp } from 'vue'
import { createPinia } from 'pinia';
import { createRouter, createWebHashHistory } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import hljsVuePlugin from '@highlightjs/vue-plugin'
import 'highlight.js/lib/common';
import App from './App.vue'
import Main from './components/Main.vue'
import GameServer from './components/GameServer.vue'
import Instance from './components/Instance.vue'
import GameType from './components/GameType.vue'
import GameState from './components/GameState.vue'
import NotFound from './components/404.vue'
import Logs from './components/Logs.vue'
import GameServersList from './components/GameServersList.vue'
import EventLogs from './components/EventLogs.vue'
import ClusterControls from './components/ClusterControls.vue'
import PlayerList from "@/components/PlayerList.vue";
import PartyList from "@/components/PartyList.vue";

import './assets/main.css'

const routes = [
    { path: '/', name: "Dashboard", component: Main },
    { path: '/server/:name', name: "Game Server", component: GameServer, props: true },
    { path: '/instance/:name', name: "View Instance", component: Instance, props: true },
    { path: '/game/:name', name: "Game Type", component: GameType, props: true },
    { path: '/game/:name/:mapName', name: "Map Name", component: GameType, props: true },
    { path: '/state/:state', name: "Game State", component: GameState, props: true },
    { path: '/logs/:namespace/:pod', name: "Pod Logs", component: Logs, props: true },
    { path: '/events', name: "Event Log", component: EventLogs },
    { path: '/gameservers', name: "Game Servers", component: GameServersList },
    { path: '/cluster', name: "Cluster Options", component: ClusterControls },
    { path: '/players', name: "Player List", component: PlayerList },
    { path: '/parties', name: "Party List", component: PartyList },
    { path: '/:pathMatch(.*)*', name: "Page Not Found", component: NotFound }, // 404 page
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
})

const app = createApp(App)
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(hljsVuePlugin);
app.component('ic', FontAwesomeIcon);
app.mount('#app');
