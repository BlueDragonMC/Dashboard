<template>
    <h1 v-if="header">View Instance</h1>
    <table v-if="info">
        <tr>
            <td>Instance Name</td>
            <router-link :to="'/instance/' + info.id">{{ info.id }}</router-link>
        </tr>
        <tr>
            <td>Game Server</td>
            <td>
                <router-link v-if="info.gameServer" :to="'/server/' + info.gameServer">{{ info.gameServer }}
                </router-link>
                <p v-else>None (Instance was likely unloaded)</p>
            </td>
        </tr>
        <tr>
            <td>Game Type</td>
            <td>{{ info.gameType?.name }}</td>
        </tr>
        <tr>
            <td>Map Name</td>
            <td>{{ info.gameType?.mapName }}</td>
        </tr>
        <tr v-if="info.gameType?.mode">
            <td>Game Mode</td>
            <td>{{ info.gameType?.mode }}</td>
        </tr>
        <tr>
            <td>Empty Player Slots</td>
            <td>{{ info.emptySlots }}</td>
        </tr>
        <tr>
            <td>Joinable</td>
            <td>{{ info?.gameState?.joinable ? "Yes" : "No" }}</td>
        </tr>
        <tr>
            <td>State</td>
            <td>{{ state }}</td>
        </tr>
    </table>
    <pre v-else>
        Loading...
    </pre>
</template>

<script>
export default {
    mounted() {
        this.refresh()
        this.interval = setInterval(this.refresh, 3000);
    },
    data() {
        return {
            info: {},
            interval: undefined,
        }
    },
    beforeUnmount() {
        if (this.interval) {
            clearInterval(this.interval)
            this.interval = undefined;
        }
    },
    computed: {
        state() {
            let name = this.info?.gameState?.stateName ?? "Loading..."
            return name.charAt(0) + name.slice(1).toLowerCase()
        }
    },
    methods: {
        refresh() {
            fetch(`http://localhost:8080/instance/${this.$props.name}`)
                .then(response => response.json())
                .then(json => {
                    this.info = json;
                })
        }
    },
    props: ["name", "header"]
}
</script>

<style scoped>

</style>