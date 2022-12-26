<template>
    <h1 class="header">Cluster</h1>
    <b>Fleet Options</b>
    <p>
        <label for="cluster-fleet-scale">Fleet Size</label>
        <input type="number" placeholder="#" id="cluster-fleet-scale" v-model="cluster.fleetScale" />
        <button @click="scaleFleet()">Scale</button>
    </p>
</template>

<script>
export default {
    props: ["gameservers"],
    methods: {
        scaleFleet() {
            const replicas = this.cluster.fleetScale;
            fetch(`/k8s/apis/agones.dev/v1/namespaces/${this.$props.gameservers[0].raw.metadata.namespace}/fleets/server/scale`, {
                method: 'PATCH',
                body: JSON.stringify({
                    spec: {
                        replicas: replicas
                    }
                }),
                headers: {
                    "Content-Type": "application/merge-patch+json"
                }
            }).then((response) => response.json()).then((json) => {
                alert("Success! The Fleet was scaled to " + replicas + " replicas.");
            }).catch((err) => {
                console.error(err);
                alert("There was an error scaling the Fleet: " + JSON.stringify(err));
            });
        }
    },
    data() {
        return {
            cluster: {
                fleetScale: this.$props.gameservers.length,
            }
        };
    },
    watch: {
        gameservers(newValue) {
            console.log(newValue);
            this.cluster.fleetScale = newValue.length;
        },
    },
}
</script>

<style scoped>

</style>