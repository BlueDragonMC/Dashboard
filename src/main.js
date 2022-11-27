import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import Main from './components/Main.vue'
import GameServer from './components/GameServer.vue'
import Instance from './components/Instance.vue'

import './assets/main.css'

const routes = [
    { path: '/', component: Main },
    { path: '/server/:name', component: GameServer },
    { path: '/instance/:name', component: Instance, props: true }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
