<template>
    <h1 v-if="header">View Instance</h1>
    <div class="card" v-if="info" :class="exists ? '' : 'faded'">
        <h2>
            <router-link :to="'/instance/' + info.id" class="muted">{{ info.id }}</router-link>
        </h2>
        <h3>{{ state }} &middot; {{ info.emptySlots }} empty slot{{ info.emptySlots == 1 ? '' : 's'}}
            ({{info.gameState?.joinable == false ? 'Not Joinable' : 'Joinable'}})</h3>
        <h3>🎮️ {{ info.gameType?.name }}</h3>
        <h3>🗺️ {{ info.gameType?.mapName }}</h3>
        <h3>⌨️ <router-link :to="'/server/' + info.gameServer" class="muted">{{ info.gameServer }}</router-link></h3>
    </div>
    <pre v-else>🔄 Loading...</pre>
</template>

<script>
export default {
    computed: {
        info() {
            return this.$props.instances[this.$props.name];
        },
        state() {
            let name = this.info?.gameState?.stateName ?? "Loading...";
            return name.charAt(0) + name.slice(1).toLowerCase();
        },
        exists() {
            return this.info != null;
        }
    },
    props: ["name", "header", "instances", "gameservers", "error"]
}

</script>

<style scoped>
.card {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 10px;
    margin: 10px 0;
}

.faded {
    opacity: 0.2;
}
</style>