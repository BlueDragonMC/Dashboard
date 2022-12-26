<script setup type="text/javascript">
// Vite doesn't allow CSS imports depending on media queries, so we have to rely on this hack to insert media-dependent style elements.
async function createStyle(colorScheme, importedTheme) {
    if (document.querySelector('#hljs-theme-' + colorScheme)) return;
    const styleElement = document.createElement('style');
    styleElement.id = "hljs-theme-" + colorScheme;
    styleElement.media = "(prefers-color-scheme: " + colorScheme + ")";
    const theme = await importedTheme;
    styleElement.innerText = theme.default;
    document.head.appendChild(styleElement);
}
createStyle("light", import("highlight.js/styles/panda-syntax-light.css?inline"));
createStyle("dark", import("highlight.js/styles/panda-syntax-dark.css?inline"));
</script>

<template>
    <main>
        <h1 class="header">Logs for {{ this.$props.pod }}</h1>
        <p>
            Showing logs since
            <input type="number" v-model="timeAgoNumber" />
            <select v-model="timeAgoMultiplier">
                <option value="86400">Days</option>
                <option value="3600">Hours</option>
                <option value="60">Minutes</option>
                <option value="1">Seconds</option>
            </select>
            ago.
        </p>

        <button v-if="needsRefresh" @click="refresh()">Update</button>

        <p v-if="loading">Loading...</p>
        <highlightjs v-else class="hljs" :autodetect="true" :code="podLogs" />
        <a @click.prevent="refresh()" v-if="stopped" href="#">Refresh</a>
    </main>
</template>

<script>
export default {
    props: ["namespace", "pod"],
    methods: {
        refresh() {
            this.loading = true;
            this.stopped = false;
            this.podLogs = "";
            this.abortController.abort();
            this.loadLogs();
            this.needsRefresh = false;
        },
        loadLogs() {
            const ns = this.$props.namespace;
            const pod = this.$props.pod;
            const url = `/k8s/api/v1/namespaces/${ns}/pods/${pod}/log?container=server&follow=true&sinceSeconds=${this.secondsAgo}`;
            this.abortController.abort();
            this.abortController = new AbortController();
            fetch(url, {
                signal: this.abortController.signal
            }).then((response) => {
                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                const read = () => {
                    reader.read().then(({ done, value }) => {
                        this.loading = false;
                        if (done) {
                            this.podLogs += "\n\n🚧 Connection to pod lost or pod was stopped.";
                            this.stopped = true;
                            return;
                        }
                        this.podLogs += decoder.decode(value);
                        console.log("Read", value.length, "bytes");
                        read();
                    });
                };
                read();
            });
        }
    },
    computed: {
        info() {
            for (const server of this.$props.gameservers) {
                if (this.$props.name == server.name) {
                    return server;
                }
            }
            return null;
        },
        secondsAgo() {
            return this.timeAgoNumber * this.timeAgoMultiplier;
        }
    },
    watch: {
        secondsAgo(newValue) {
            this.needsRefresh = true;
        }
    },
    data() {
        return {
            podLogs: "",
            loading: true,
            stopped: false,
            abortController: new AbortController(),
            timeAgoNumber: 10,
            timeAgoMultiplier: 60,
            needsRefresh: false,
        };
    },
    mounted() {
        this.loadLogs();
    },
    beforeUnmount() {
        this.abortController.abort();
    }
}
</script>

<style scoped>
pre {
    white-space: pre-wrap;
    font-size: 12px;
    font-family: unset;
}
</style>