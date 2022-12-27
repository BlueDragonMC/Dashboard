<script setup>
import imgUrl from "../assets/favicon_hq.png"
</script>

<template>
    <div>
        <img :src="imgUrl" />
        <h1 class="header">404</h1>
        <h2>Page not found. <router-link :to="'/'">Click here</router-link> to return to the home page.</h2>
    </div>
</template>

<style scoped>
img {
    width: 256px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
h1.header {
    font-size: 72px;
    text-align: center;
}
h2 {
    text-align: center;
}
</style>