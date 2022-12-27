<template>
    <p>Namespace: <code>{{ namespace ?? "<Unknown>" }}</code></p>

    <h2>Agones Options</h2>
    <div class="optgroup fleet-options">

        <p>Fleet Size</p>
        <input type="number" placeholder="#" id="cluster-fleet-scale" v-model="cluster.fleetScale" />
        <button @click="scaleFleet()">Scale</button>

    </div>
</template>

<script>
import { mapWritableState } from 'pinia';
import { useStore } from '../stores/store';

export default {
    methods: {
        scaleFleet() {
            this.namespacedRequest(
                (ns) => `/k8s/apis/agones.dev/v1/namespaces/${ns}/fleets/server/scale`,
                "PATCH",
                { // body
                    spec: {
                        replicas: this.cluster.fleetScale
                    }
                },
                { // headers
                    "Content-Type": "application/merge-patch+json"
                }
            );
        },
        namespacedRequest(urlSupplier, method, body, headers) {
            const ns = this.namespace ?? prompt("What Kubernetes namespace should be used?");
            fetch(urlSupplier(ns), {
                method: method,
                body: JSON.stringify(body),
                headers: headers
            }).then((response) => {
                if (response.status >= 400 || !response.ok) {
                    throw new DOMException(response.status + " " + response.statusText);
                }
                return response.json();
            }).then((json) => {
                console.log(json);
                alert("Success!");
            }).catch((err) => {
                console.error(err);
                alert("There was an error performing the request:\n" + err);
            });
        }
    },
    data() {
        return {
            cluster: {
                fleetScale: 0,
            }
        };
    },
    watch: {
        gameservers(newValue) {
            this.cluster.fleetScale = newValue.length;
        },
    },
    computed: {
        namespace() {
            if (this.gameservers.length > 0) {
                return this.gameservers[0].raw.metadata.namespace;
            } else {
                return null;
            }
        },
        ...mapWritableState(useStore, ["gameservers"])
    },
    mounted() {
        if (this.gameservers) {
            this.cluster.fleetScale = this.gameservers.length;
        }
    }
}
</script>

<style scoped>
.optgroup {
    background-color: var(--accent-background);
    border-radius: 10px;
    padding: 10px;
}

.fleet-options {
    display: grid;
    grid-template-columns: repeat(3, auto);
    max-width: min-content;
    grid-column-gap: 1em;
    white-space: nowrap;
    align-items: center;
}

.fleet-options p {
    font-weight: bold;
}

.fleet-options button {
    width: min-content;
    padding: 5px 15px;
    background-color: var(--accent-background);
    color: inherit;
    border-radius: 10px;
    border: none;
}

input[type=number] {
    padding: 5px;
    max-width: 80px;
}
</style>