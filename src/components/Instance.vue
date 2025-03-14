<script setup type="text/javascript">
import { faFilter, faGamepad, faMap, faServer, faUsers } from '@fortawesome/free-solid-svg-icons';
import PlayerIcon from "@/components/PlayerIcon.vue";
</script>

<template>
    <h1 v-if="header !== false">View Instance</h1>
    <div class="card" v-if="exists">
        <h2>
            <!-- Instance ID -->
            <router-link :to="'/instance/' + info.id" class="muted">{{ info.id }}</router-link>
        </h2>
        <!-- State, empty slots, and joinable (yes/no) -->
        <h3>
            <router-link :to="'/state/' + info.gameState?.stateName" class="muted">{{ state }}</router-link>
            &middot;
            {{ info.emptySlots }} empty slot{{ info.emptySlots === 1 ? '' : 's' }}
            ({{ info.gameState?.joinable === false ? 'Not Joinable' : 'Joinable' }})
        </h3>
        <h3>
            <!-- Game name -->
            <ic :icon="faGamepad" />
            <router-link :to="'/game/' + info.gameType?.name" class="muted">
                {{ info.gameType?.name }}
            </router-link>
        </h3>
        <h3>
            <!-- Map name -->
            <ic :icon="faMap" />
            <router-link :to="'/game/' + info.gameType?.name + '/' + info.gameType?.mapName" class="muted">
                {{ info.gameType?.mapName }}
            </router-link>
        </h3>
        <h3 v-if="info.gameType?.mode">
            <!-- Map name -->
            <ic :icon="faFilter" />
            <router-link :to="'/game/' + info.gameType?.name + '/' + info.gameType?.mapName" class="muted">
                {{ info.gameType?.mode }}
            </router-link>
        </h3>
        <h3>
            <!-- Server name -->
            <ic :icon="faServer" />
            <router-link :to="'/server/' + info.gameServer" class="muted">{{ info.gameServer }}</router-link>
        </h3>
        <div v-if="myPlayers.length > 0" class="player-list">
            <h3>
                <ic :icon="faUsers" />
                Players ({{ myPlayers.length }}):
            </h3>
            <PlayerIcon v-for="player in myPlayers" :size="32" :player="player" />
        </div>
    </div>
    <div v-else-if="loaded">
        <h2>Not found</h2>
        <p>The instance <code>{{ $props.name }}</code> does not exist. It may have been deleted or unregistered.</p>
    </div>
    <h3 v-else>🔄 Loading <code>{{ $props.name }}</code>...</h3>
</template>

<script>
import { mapState } from 'pinia';
import { useStore } from '../stores/store';

export default {
    computed: {
        info() {
            return this.instances[this.$props.name];
        },
        state() {
            let name = this.info?.gameState?.stateName ?? "Loading...";
            return name.charAt(0) + name.slice(1).toLowerCase();
        },
        loaded() {
            return !!this.instances;
        },
        exists() {
            return !!this.info;
        },
        myPlayers() {
            return this.players.filter((it) => it.gameId === this.info.id) ?? [];
        },
        ...mapState(useStore, ["instances", "gameservers", "players", "usernames", "error"]),
    },
    props: ["name", "header"]
}

</script>

<style scoped>
.card {
    background: var(--accent-background);
    border-radius: 10px;
    padding: 10px;
    margin: 10px 0;
}

.faded {
    opacity: 0.2;
}

svg {
    margin-right: 5px;
}

.player-list {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
}
</style>