<script type="text/javascript" setup>
import { faTag, faGamepad, faMap, faSpinner, faDoorOpen, faUsers, faFilter } from '@fortawesome/free-solid-svg-icons';
</script>

<template>
    <div class="gs-table">
        <template v-for="server in gameservers">
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
                        <td class="hide-xs"><ic :icon="faTag" /> Name</td>
                        <td><ic :icon="faGamepad" /> Game</td>
                        <td><ic :icon="faMap" /> Map</td>
                        <td><ic :icon="faFilter" /> Mode</td>
                        <td><ic :icon="faSpinner" /> State</td>
                        <td><ic :icon="faDoorOpen" /> Slots</td>
                        <td class="hide-xs"><ic :icon="faUsers" /> Players</td>
                    </tr>
                    <TransitionGroup name="list">
                        <tr v-for="instance in getInstances(server)" :key="instance.id">
                            <td class="hide-xs"> <!-- Primary instance name -->
                                <router-link class="small muted" :to="'/instance/' + instance.id">
                                    {{ instance.id.substring(0, 8) }}
                                </router-link>
                            </td>
                            <td class="small"> <!-- Game type -->
                                <router-link :to="'/game/' + instance.gameType.name" class="muted">
                                    {{ instance.gameType.name }}
                                </router-link>
                            </td>
                            <td class="small"> <!-- Map name -->
                                <router-link :to="'/game/' + instance.gameType.name + '/' + instance.gameType.mapName"
                                    class="muted">
                                    {{ instance.gameType.mapName }}
                                </router-link>
                            </td>
                            <td class="small"> <!-- Game mode -->
                                <router-link :to="'/game/' + instance.gameType.name + '/' + instance.gameType.mapName"
                                    class="muted">
                                    {{ instance.gameType.mode }}
                                </router-link>
                            </td>
                            <td class="small"> <!-- Game state -->
                                <router-link :to="'/state/' + instance.gameState?.stateName" class="muted">
                                    {{ instance.gameState.stateName }}
                                </router-link>
                            </td>
                            <td class="small"> <!-- Open slots -->
                                {{ instance.gameState.playerCount }}/{{ getTotalPlayers(instance) }}
                            </td>
                            <td class="small hide-xs"> <!-- In-game players -->
                                <TransitionGroup name="players">
                                    <img v-for="player in players[instance.id]" :key="player"
                                        :src="'https://crafatar.com/avatars/' + player + '?size=24&overlay=true'"
                                        class="player-icon" :title="usernames[player]" :alt="usernames[player]" />
                                </TransitionGroup>
                            </td>
                        </tr>
                    </TransitionGroup>
                </table>
            </div>
        </template>
    </div>
</template>

<script>
import { mapWritableState } from 'pinia';
import { useStore } from '../stores/store';

export default {
    methods: {
        getInstances(server) {
            return server.instances
                .map((instanceId) => this.instances[instanceId])
                .filter((instance) => instance != null);
        },
        getTotalPlayers(instance) {
            return instance.gameState.openSlots + instance.gameState.playerCount;
        },
    },
    computed: {
        ...mapWritableState(useStore, ["gameservers", "instances", "players", "usernames"])
    }
}
</script>

<style scoped>
.gs-table {
    display: grid;
    grid-template-columns: min-content auto;
    grid-column-gap: 1em;
    grid-row-gap: 1em;
    margin: 1em 0;
    align-items: center;
    white-space: nowrap;
}

@media screen and (max-width: 700px) {
    .gs-table {
        grid-template-columns: auto;
    }
}

table.child-table {
    background: var(--accent-background);
    border-radius: 10px;
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