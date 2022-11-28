<template>
    <h1 v-if="header !== false">View Instance</h1>
    <div class="card" v-if="info" :class="exists ? '' : 'faded'">
        <h2> <!-- Instance ID -->
            <router-link :to="'/instance/' + info.id" class="muted">{{ info.id }}</router-link>
        </h2>
        <!-- State, empty slots, and joinable (yes/no) -->
        <h3>{{ state }} &middot; {{ info.emptySlots }} empty slot{{ info.emptySlots == 1 ? '' : 's' }}
            ({{ info.gameState?.joinable == false ? 'Not Joinable' : 'Joinable' }})</h3>
        <h3> <!-- Game name -->
            🎮️ <router-link :to="'/game/' + info.gameType?.name" class="muted">
                {{ info.gameType?.name }}
            </router-link>
        </h3>
        <h3> <!-- Map name -->
            🗺️ <router-link :to="'/game/' + info.gameType?.name + '/' + info.gameType?.mapName" class="muted">
                {{ info.gameType?.mapName }}
            </router-link>
        </h3>
        <h3>⌨️ <router-link :to="'/server/' + info.gameServer" class="muted">{{ info.gameServer }}</router-link>
        </h3>
    </div>
    <pre v-else>🔄 Loading '{{ this.$props.name }}'...</pre>
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