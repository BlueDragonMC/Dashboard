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
    <router-view></router-view>
    <p>&copy; 2022 <a href="//bluedragonmc.com">BlueDragonMC</a>. Made with ❤️ and <a href="//vuejs.org">Vue 3</a>.</p>
</template>

<style scoped>
img.logo {
    height: 1em;
    vertical-align: text-bottom;
}
</style>