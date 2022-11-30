<template>
  <main>
    <table :class="$props.error ? 'error' : ''">
      <thead>
        <tr>
          <th>Server</th>
          <th>Instances</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="server in $props.gameservers">
          <td>
            <!-- Server name and address -->
            <router-link class="bold" :to="'/server/' + server.name">{{ server.name }}</router-link>
            <br />
            <pre class="small">{{ server.address }}:{{ server.port }}</pre>
            <p class="small">{{ server.instances.length }} instances</p>
          </td>
          <td>
            <table>
              <tr>
                <td>Name</td>
                <td>🎮️ Game</td>
                <td>🗺️ Map</td>
                <td>State</td>
                <td>Slots</td>
                <td>Players</td>
              </tr>
              <TransitionGroup name="list">
                <tr v-for="instance in getInstances(server)" :key="instance.id">
                  <td>
                    <router-link class="small muted" :to="'/instance/' + instance.id">{{ instance.id }}</router-link>
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
                  <td class="small">
                    <TransitionGroup name="players">
                      <img v-for="player in $props.players[instance.id]" :key="player"
                        :src="'https://crafatar.com/avatars/' + player + '?size=24&overlay=true'" class="player-icon"
                        :title="$props.usernames[player]" :alt="$props.usernames[player]" />
                    </TransitionGroup>
                  </td>
                </tr>
              </TransitionGroup>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<script>
export default {
  props: ["instances", "gameservers", "players", "usernames", "error"],
  methods: {
    getInstances(server) {
      return server.instances
        .map((instanceId) => this.$props.instances[instanceId])
        .filter((instance) => instance != null);
    },
    getTotalPlayers(instance) {
      return instance.gameState.openSlots + instance.gameState.playerCount;
    },
  }
}
</script>

<style scoped>
table {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

@media(prefers-color-scheme: light) {
    table {
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
