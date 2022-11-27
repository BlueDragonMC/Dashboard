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
                  {{ $props.instances[instance]?.gameType.name }}
                </td>
                <td class="small">
                  {{ $props.instances[instance]?.gameType.mapName }}
                </td>
                <td class="small">
                  {{ $props.instances[instance]?.gameState.stateName }}
                </td>
                <td class="small">
                  {{ $props.instances[instance]?.gameState.openSlots }}
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
  props: ["instances", "gameservers", "error"]
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
</style>
