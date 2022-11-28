<script type="text/javascript" setup>
import Instance from "./Instance.vue";
</script>

<template>
    <h1>🎮️ Game Type: {{ $route.params.name }}</h1>
    <h2 v-if="$props.mapName">🗺️ Map Name: {{ $route.params.mapName }}</h2>
    <div v-if="typedInstances">
        <div v-for="instance in typedInstances">
            <Instance :name="instance.id" :header="false" :instances="$props.instances"
                :gameservers="$props.gameservers" />
        </div>
    </div>
    <h2 v-else-if="this.$props.gameservers.length == 0">Loading...</h2>
    <h2 v-else>No matching game servers were found.</h2>
</template>

<script>
export default {
    props: ["name", "mapName", "instances", "gameservers", "error"],
    computed: {
        typedInstances() {
            return Object.values(this.$props.instances).filter(instance => {
                if (instance.gameType.name != this.$props.name) {
                    return false;
                }
                if (this.$route.params.mapName) {
                    if (instance.gameType.mapName != this.$props.mapName) {
                        return false;
                    }
                }
                return true;
            })
        }
    }
}
</script>