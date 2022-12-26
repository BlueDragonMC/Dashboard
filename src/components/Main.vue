<script setup type="text/javascript">
import ClusterControls from "./ClusterControls.vue"
</script>

<template>
  <main>
    <!-- Events column -->
    <div class="col logs-panel">
      <h1 class="header">Events</h1>
      <div class="log-entries" :ref="'log-entries'">
        <p v-for="log in logs.items" class="log-entry">
          <span class="log-type">{{ logs.types[log.type] }}</span>
          <span class="log-time">{{ new Date(log.time).toLocaleTimeString() }}</span>
          <span class="log-message">{{ log.message }}</span>
        </p>
        <input type="checkbox" id="autoscroll-checkbox" v-model="autoscroll" />
        <label for="autoscroll-checkbox">Scroll to bottom</label>
      </div>
    </div>
    <!-- Game servers column -->
    <div class="col gs-panel">
      <h1 class="header">Game Servers</h1>
      <div class="gs-table">
        <div class="gs-table-row" v-for="server in $props.gameservers">
          <div class="gs-table-row-server-meta">
            <!-- Server name and address -->
            <router-link class="bold" :to="'/server/' + server.name">{{ server.name }}</router-link>
            <br />
            <pre class="small">{{ server.address }}:{{ server.port }}</pre>
            <p class="small">{{ server.instances.length }} instances</p>
          </div>
          <div class="gs-table-row-server-details">
            <table class="child-table">
              <tr>
                <td class="hide-xs">✏️ Name</td>
                <td>🎮️ Game</td>
                <td>🗺️ Map</td>
                <td>🎲 State</td>
                <td>💾 Slots</td>
                <td class="hide-xs">😀 Players</td>
              </tr>
              <TransitionGroup name="list">
                <tr v-for="instance in getInstances(server)" :key="instance.id">
                  <td class="hide-xs">
                    <router-link class="small muted" :to="'/instance/' + instance.id">
                      <span>{{ instance.id.substring(0, 8) }}</span>
                      <span class="hide-sm">{{ instance.id.substring(8, 36) }}</span>
                    </router-link>
                  </td>
                  <td class="small">
                    <router-link :to="'/game/' + instance.gameType.name" class="muted">
                      {{ instance.gameType.name }}
                    </router-link>
                  </td>
                  <td class="small">
                    <router-link :to="'/game/' + instance.gameType.name + '/' + instance.gameType.mapName"
                      class="muted">
                      {{ instance.gameType.mapName }}
                    </router-link>
                  </td>
                  <td class="small">
                    <router-link :to="'/state/' + instance.gameState?.stateName" class="muted">
                      {{ instance.gameState.stateName }}
                    </router-link>
                  </td>
                  <td class="small">
                    {{ instance.gameState.playerCount }}/{{ getTotalPlayers(instance) }}
                  </td>
                  <td class="small hide-xs">
                    <TransitionGroup name="players">
                      <img v-for="player in $props.players[instance.id]" :key="player"
                        :src="'https://crafatar.com/avatars/' + player + '?size=24&overlay=true'" class="player-icon"
                        :title="$props.usernames[player]" :alt="$props.usernames[player]" />
                    </TransitionGroup>
                  </td>
                </tr>
              </TransitionGroup>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- Cluster actions column -->
    <div class="col cluster-panel">
      <ClusterControls :gameservers="gameservers" />
    </div>
  </main>
</template>

<script>
export default {
  props: ["instances", "gameservers", "players", "usernames", "error", "logs"],
  methods: {
    getInstances(server) {
      return server.instances
        .map((instanceId) => this.$props.instances[instanceId])
        .filter((instance) => instance != null);
    },
    getTotalPlayers(instance) {
      return instance.gameState.openSlots + instance.gameState.playerCount;
    },
  },
  data() {
    return {
      autoscroll: true,
    };
  },
  watch: {
    logs: {
      deep: true,
      handler() {
        if (this.autoscroll) {
          setTimeout(() => {
            const parent = this.$refs["log-entries"];
            const el = parent.children[parent.children.length - 1];
            el.scrollIntoView({ behavior: "smooth", block: "end" });
          }, 0);
        }
      }
    }
  }
}
</script>

<style scoped>
b {
  font-weight: bold;
}

.col.logs-panel {
  overflow: hidden;
}

.log-time,
.log-type,
.log-message {
  padding: 5px;
}

#autoscroll-checkbox {
  margin-left: 5px;
  margin-right: 10px;
}

.log-time {
  font-weight: bold;
}

.log-message {
  font-family: 'Courier New', Courier, monospace;
}

.gs-table-row {
  display: grid;
  grid-template-columns: min-content auto;
  grid-column-gap: 1em;
  margin: 1em 0;
  align-items: center;
  white-space: nowrap;
}

main {
  display: grid;
  grid-auto-flow: row dense;
  grid-template-columns: repeat(3, auto);
  grid-column-gap: 1em;
}

.col.gs-panel {
  /* The Game Servers panel is twice as large as the other panels */
  grid-column: span 2;
  grid-row: span 2;
}

@media screen and (max-width: 1100px) {
  main {
    grid-template-columns: auto;
  }
}

@media screen and (max-width: 700px) {
  .gs-table-row {
    grid-template-columns: auto;
  }
}

.col {
  min-width: 100%;
  overflow: scroll;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.2em 0.6em;
  margin-bottom: 10px;
}

table.child-table {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

@media(prefers-color-scheme: light) {
  table.child-table {
    background: rgba(0, 0, 0, 0.1);
  }
}

th,
td {
  padding: 5px 15px;
}

table {
  width: 100%;
  transition: opacity 0.25s ease-in;
}

table table td {
  padding: 5px;
}

table.error {
  opacity: 0.25;
}

thead>tr>*,
.bold {
  font-weight: bold;
}

.small {
  font-size: small;
}

img.player-icon {
  width: 24px;
  height: 24px;
  /* Disable nearest-neighbor (blurry) image upscaling */
  image-rendering: -moz-crisp-edges;
  image-rendering: pixelated;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from {
  opacity: 0;
}

.list-leave-to {
  opacity: 0;
}

.players-enter-active,
.players-leave-active {
  transition: all 0.5s ease;
}

.players-enter-from,
.players-leave-to {
  opacity: 0;
}
</style>
