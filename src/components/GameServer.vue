<script type="text/javascript" setup>
import Instance from './Instance.vue';
</script>

<template>
    <h1>{{ $route.params.name }}</h1>
    <pre>{{ info.address }}:{{ info.port }}</pre>
    <hr />
    <div v-for="instance in info.instances">
        <Instance :name="instance" :header="false" />
        <hr />
    </div>
</template>

<script>
export default {
    mounted() {
        this.refresh()
        this.interval = setInterval(this.refresh, 2000);
    },
    beforeUnmount() {
        if (this.interval) {
            clearInterval(this.interval)
            this.interval = undefined;
        }
    },
    data() {
        return {
            info: {},
            interval: undefined,
        }
    },
    methods: {
        refresh() {
            fetch(`http://localhost:8080/gameservers`)
                .then(response => response.json())
                .then(json => {
                    this.info = json["gameServers"].find(element => {
                        return element["name"] == this.$route.params.name
                    });
                })
        }
    }
}
</script>

<style scoped>
hr {
    border: 1px solid gray;
    margin: 0.5em 0;
}
</style>