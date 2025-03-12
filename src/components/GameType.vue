<script setup type="text/javascript">
import Instance from "./Instance.vue";
</script>

<template>
    <main>
        <h2 v-if="$props.mapName">
            🗺️ Map Name: {{ $route.params.mapName }}
            <span class="small">
                (<router-link :to="'/game/' + $route.params.name">Clear Filter</router-link>)
            </span>
        </h2>
        <div v-if="typedInstances">
            <h2>There are <b>{{ typedInstances.length }}</b> instances that match the current game type filter.</h2>
            <div v-for="instance in typedInstances">
                <Instance :name="instance.id" :header="false" />
            </div>
        </div>
        <h2 v-else-if="this.$props.gameservers.length === 0">Loading...</h2>
        <h2 v-else>No matching game servers were found.</h2>
    </main>
</template>

<script>
import { mapState } from "pinia";
import { useStore } from "../stores/store";

export default {
    props: ["name", "mapName"],
    computed: {
        typedInstances() {
            return Object.values(this.instances).filter(instance => {
                if (instance.gameType.name !== this.$props.name) {
                    return false;
                }
                if (this.$route.params.mapName) {
                    if (instance.gameType.mapName !== this.$props.mapName) {
                        return false;
                    }
                }
                return true;
            })
        },
        ...mapState(useStore, ["instances"]),
    }
}
</script>

<style scoped>
.small {
    font-size: small;
}

b {
    font-weight: bold;
}
</style>