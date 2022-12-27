<script type="text/javascript" setup>
import { mapState } from "pinia";
import { useStore } from "../stores/store";
import Instance from "./Instance.vue";
</script>

<template>
    <main>
        <div v-if="typedInstances.length > 0">
            <h2>There are {{ typedInstances.length }} instances in the {{ $props.state }} state.</h2>
            <div v-for="instance in typedInstances">
                <Instance :name="instance.id" :header="false" />
            </div>
        </div>
        <h2 v-else-if="gameservers.length == 0">Loading...</h2>
        <div v-else>
            <h2>No matching game servers were found.</h2>
            <h3><router-link :to="'/'">Click here</router-link> to return to the home page.</h3>
        </div>
    </main>
</template>

<script>
export default {
    props: ["state"],
    computed: {
        typedInstances() {
            return Object.values(this.instances).filter(instance => {
                return instance.gameState.stateName == this.$props.state;
            })
        },
        displayText() {
            let text = this.$props.state;
            return text.charAt(0) + text.slice(1).toLowerCase();
        },
        ...mapState(useStore, ["gameservers", "instances"]),
    }
}
</script>