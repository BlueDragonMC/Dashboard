<script setup type="text/javascript">
import { mapWritableState } from "pinia";
import { TransitionGroup } from "vue";
import { useStore } from "../stores/store";
import { faGears, faCircleNodes, faServer, faChess, faCalendarDays } from "@fortawesome/free-solid-svg-icons"
</script>

<template>
  <main>
    <router-link :to="'/events'" class="link">
      <ic class="icon" :icon="faCalendarDays" />
      <p>Event Logs</p>
    </router-link>
    <router-link :to="'/cluster'" class="link">
      <ic class="icon" :icon="faCircleNodes" />
      <p>Cluster Options</p>
    </router-link>
    <router-link :to="'/gameservers'" class="link">
      <ic class="icon" :icon="faServer" />
      <p>Game Servers</p>
    </router-link>
    <router-link :to="'/state/INGAME'" class="link">
      <ic class="icon" :icon="faChess" />
      <p>Active Instances</p>
    </router-link>
  </main>
</template>

<script>
export default {
  components: { TransitionGroup },
  computed: {
    ...mapWritableState(useStore, ["events"])
  }
}
</script>

<style scoped>
main {
  display: grid;
  grid-template-columns: repeat(4, auto);
  grid-auto-flow: row dense;
  grid-column-gap: 1em;
}

.link {
  overflow: scroll;
  background: var(--accent-background);
  border-radius: 10px;
  padding: 1em;
  margin-bottom: 10px;
  color: inherit;
}

.link .icon {
  font-size: 72px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.link p {
  display: block;
  text-align: center;
  font-size: x-large;
  font-weight: bold;
  margin-top: 0.5em;
}
</style>
