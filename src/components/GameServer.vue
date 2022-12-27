<script type="text/javascript" setup>
import Instance from './Instance.vue';
import Logs from './Logs.vue';
</script>

<template>
    <main>
        <h1 class="header">{{ $route.params.name }}</h1>
        <div v-if="info">
            <code>
                <p><b>Namespace:</b> {{ info?.raw?.metadata?.namespace }}</p>
                <p><b>Image:</b> {{ info?.raw?.spec?.template?.spec?.containers?.[0]?.image }}</p>
                <p><b>Node:</b> {{ info?.raw?.status?.nodeName }}</p>
                <p><b>Status:</b> {{ info?.raw?.status?.state }}</p>
                <p>
                    <b>Reserved until:</b> {{ info?.raw?.status?.reservedUntil ? new Date(info?.raw?.status?.reservedUntil).toLocaleString() : "Not reserved" }}
                </p>
                <p><b>Address:</b> {{ info?.address }}:{{ info?.port }}</p>
                <router-link :to="'/logs/' + info.raw.metadata.namespace + '/' + $route.params.name" target="_blank" 
                    rel="noopener noreferrer">View Logs in New Tab</router-link>
            </code>

            <div class="grid-parent">
                <div class="instances-col">
                    <div v-for="instance in info.instances">
                        <Instance :name="instance" :header="false" :instances="$props.instances"
                            :gameservers="$props.gameservers" :players="$props.players" :usernames="$props.usernames" />
                    </div>
                </div>
                <div class="logs-col">
                    <Logs :namespace="info.raw.metadata.namespace" :pod="$route.params.name"></Logs>
                </div>
            </div>
        </div>
        <h2 v-else-if="$props.gameservers.length == 0">Loading...</h2>
        <h2 v-else>Game server not found</h2>
    </main>
</template>

<script>
export default {
    computed: {
        info() {
            for (const server of this.$props.gameservers) {
                if (this.$props.name == server.name) {
                    return server;
                }
            }
            return null;
        }
    },
    props: ["name", "instances", "gameservers", "players", "usernames", "error"],
    components: { Logs }
}
</script>

<style scoped>
b {
    font-weight: bold;
}

.grid-parent {
    display: grid;
    grid-template-columns: min-content auto;
    grid-column-gap: 1em;
}

.instances-col {
    white-space: nowrap;
}
</style>