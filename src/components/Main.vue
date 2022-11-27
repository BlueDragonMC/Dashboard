<template>
  <main>
    <pre v-if="error">⚠️ {{ error }}</pre>
    <table>
      <thead>
        <tr>
          <th>Server</th>
          <th>Instances</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="server in gameservers">
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
                <td>Game</td>
                <td>Map</td>
                <td>State</td>
                <td>Slots</td>
              </tr>
              <tr v-for="instance in server.instances">
                <td>
                  <router-link class="small muted" :to="'/instance/' + instance">{{ instance }}</router-link>
                </td>
                <td class="small">
                  {{ instances[instance]?.gameType.name }}
                </td>
                <td class="small">
                  {{ instances[instance]?.gameType.mapName }}
                </td>
                <td class="small">
                  {{ instances[instance]?.gameState.stateName }}
                </td>
                <td class="small">
                  {{ instances[instance]?.gameState.openSlots }}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<script>
export default {
  created() {
    this.update();
    this.interval = setInterval(this.update, 5000);
  },
  beforeUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined;
    }
  },
  data() {
    return {
      interval: undefined,
      gameservers: [],
      instances: {},
      error: undefined,
      updatedAt: Date.now(),
    }
  },
  methods: {
    update() {
      fetch("http://localhost:8080/gameservers")
        .then(response => response.json())
        .then(json => {
          let servers = json["gameServers"];
          this.gameservers = servers;
          this.error = undefined;
          for (const server of servers) {
            for (const instance of server.instances) {
              this.fetchInstance(instance);
            }
          }
          this.updatedAt = Date.now()
        }).catch(err => {
          this.error = err;
        });
    },
    fetchInstance(uuid) {
      fetch(`http://localhost:8080/instance/${uuid}`)
        .then(response => response.json())
        .then(json => {
          this.instances[uuid] = json;
        })
    }
  }
}
</script>

<style scoped>
table {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

th,
td {
  padding: 20px;
}

table {
  width: 100%;
}

table table td {
  padding: 5px;
}

thead>tr>*,
.bold {
  font-weight: bold;
}

.small {
  font-size: small;
}
</style>
