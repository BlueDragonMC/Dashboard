<script type="text/javascript" setup>
import Instance from "./Instance.vue";
</script>

<template>
    <main>
        <h1>🎲 Game State: {{ displayText }}</h1>
        <p>There are {{ typedInstances.length }} instances in the {{ $props.state }} state.</p>
        <div v-if="typedInstances.length > 0">
            <div v-for="instance in typedInstances">
                <Instance :name="instance.id" :header="false" :instances="$props.instances"
                    :gameservers="$props.gameservers" :players="$props.players" :usernames="$props.usernames" />
            </div>
        </div>
        <h2 v-else-if="this.$props.gameservers.length == 0">Loading...</h2>
        <div v-else>
            <h2>No matching game servers were found.</h2>
            <h3><router-link :to="'/'">Click here</router-link> to return to the home page.</h3>
        </div>
    </main>
</template>

<script>
export default {
    props: ["state", "instances", "gameservers", "players", "usernames", "error"],
    computed: {
        typedInstances() {
            return Object.values(this.$props.instances).filter(instance => {
                return instance.gameState.stateName == this.$props.state;
            })
        },
        displayText() {
            let text = this.$props.state;
            return text.charAt(0) + text.slice(1).toLowerCase();
        }
    }
}
</script>