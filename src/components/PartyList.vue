<template>
    <h1>Parties</h1>

    <div class="card" v-for="party in parties">
        <h3>Members</h3>
        <table>
            <tbody>
                <tr v-for="member in [...new Set(party.members.concat(party.invitations))]" :key="member">
                    <td>
                        <PlayerIcon :player="players.find((it) => it.uuid === member)" :size="32" />
                    </td>
                    <td>{{ players.find((it) => it.uuid === member)?.username ?? member }}</td>
                    <td>
                        {{ member === party.leader ? "Leader" : party.invitations.includes(member) ? "Outgoing Invitation" : "Member" }}
                    </td>
                </tr>
            </tbody>
        </table>

        <h3 v-if="party.marathon">Marathon Progress</h3>
        <p>Ends at: {{ new Date(party.marathon.endsAt).toLocaleString() }}</p>
        <table>
            <tbody>
            <tr v-for="(points, member) in party.marathon.points" :key="member">
                <td>
                    <PlayerIcon :player="players.find((it) => it.uuid === member)" :size="32" />
                </td>
                <td>{{ players.find((it) => it.uuid === member)?.username ?? member }}</td>
                <td>
                    {{ points }}
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import {mapWritableState} from "pinia";
import {useStore} from "@/stores/store.js";
import PlayerIcon from "@/components/PlayerIcon.vue";

export default {
    components: {PlayerIcon},
    computed: {
        ...mapWritableState(useStore, ["parties", "players"])
    }
}
</script>

<style scoped>
.card {
    background: var(--accent-background);
    border-radius: 10px;
    padding: 10px;
    margin: 10px 0;
}

th,
td {
    padding: 5px 15px;
}

.player-icon {
    vertical-align: middle;
}

.row {
    display: flex;
    gap: 0.25rem;
}
</style>