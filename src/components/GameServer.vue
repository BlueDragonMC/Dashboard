<script type="text/javascript" setup>
import Instance from './Instance.vue';
</script>

<template>
    <h1>{{ $route.params.name }}</h1>
    <div v-if="info">
        <pre>{{ info?.address }}:{{ info?.port }}</pre>
        <div v-for="instance in info.instances">
            <Instance :name="instance" :header="false" :instances="$props.instances"
                :gameservers="$props.gameservers" />
        </div>
    </div>
    <h2 v-else-if="this.$props.gameservers.length == 0">Loading...</h2>
    <h2 v-else>Game server not found</h2>
</template>

<script>
export default {
    computed: {
        info() {
            for (const server of this.$props.gameservers) {
                if (this.$route.params.name == server.name) {
                    return server;
                }
            }
            return null;
        }
    },
    props: ["instances", "gameservers", "error"]
}
</script>

<style scoped>

</style>