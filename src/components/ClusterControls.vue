<template>
    <p>Namespace: <code>{{ namespace ?? "<Unknown>" }}</code></p>

    <h2>Game Server Options</h2>
    <div class="optgroup server-options">

        <p>Server Count</p>
        <input type="number" placeholder="#" id="cluster-server-scale" v-model="cluster.serverReplicas" />
        <button @click="scaleServers()">Scale</button>

    </div>
</template>

<script>
import { mapWritableState } from 'pinia';
import { useStore } from '../stores/store';

export default {
    methods: {
        scaleServers() {
            this.namespacedRequest(
                (ns) => `/k8s/apis/apps/v1/namespaces/${ns}/deployments/server/scale`,
                "PATCH",
                { // body
                    spec: {
                        replicas: this.cluster.serverReplicas
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
                serverReplicas: 0,
            }
        };
    },
    watch: {
        gameservers(newValue) {
            this.cluster.serverReplicas = newValue.length;
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
            this.cluster.serverReplicas = this.gameservers.length;
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

.server-options {
    display: grid;
    grid-template-columns: repeat(3, auto);
    max-width: min-content;
    grid-column-gap: 1em;
    white-space: nowrap;
    align-items: center;
}

.server-options p {
    font-weight: bold;
}

.server-options button {
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