<template>
    <h1>Players</h1>

    <table>
        <thead>
            <tr>
                <td>#</td>
                <th>Username</th>
                <th>UUID</th>
                <th>Proxy</th>
                <th>Game Server</th>
                <th>Game ID</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(player, i) in Object.values(players)">
                <td>{{ i + 1 }}</td>
                <td>
                    <PlayerIcon :size="32" :player="player" />
                    {{ player.username }}
                </td>
                <td>{{ player.uuid }}</td>
                <td>{{ player.proxyPodName }}</td>
                <td><router-link :to="'/server/' + player.gameServerName">{{ player.gameServerName }}</router-link></td>
                <td><router-link :to="'/instance/' + player.gameId">{{ player.gameId }}</router-link></td>
            </tr>
        </tbody>
    </table>
</template>

<script>
import {mapWritableState} from "pinia";
import {useStore} from "@/stores/store.js";
import PlayerIcon from "@/components/PlayerIcon.vue";

export default {
    components: {PlayerIcon},
    computed: {
        ...mapWritableState(useStore, ["players"])
    }
}
</script>

<style scoped>
th,
td {
    padding: 5px 15px;
}

.player-icon {
    vertical-align: middle;
}
</style>