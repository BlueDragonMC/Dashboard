import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
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

import './assets/main.css'

const routes = [
    { path: '/', component: Main },
    { path: '/server/:name', component: GameServer, props: true },
    { path: '/instance/:name', component: Instance, props: true },
    { path: '/game/:name', component: GameType, props: true },
    { path: '/game/:name/:mapName', component: GameType, props: true },
    { path: '/state/:state', component: GameState, props: true },
    { path: '/logs/:namespace/:pod', component: Logs, props: true },
    { path: '/:pathMatch(.*)*', component: NotFound }, // 404 page
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
})

const app = createApp(App)
app.use(router)
app.use(hljsVuePlugin)
app.mount('#app')
