<template>
    <div class="log-entries" :ref="'log-entries'">
        <TransitionGroup name="logs">
            <p v-for="log in events" class="log-entry" :key="log.id">
                <ic class="log-type" :icon="log.type" />
                <span class="log-time">{{ log.time }}</span>
                <span class="log-message">{{ log.message }}</span>
                <span class="extra-info">{{ log.extra }}</span>
            </p>
        </TransitionGroup>
    </div>
</template>

<script>
import { mapState } from 'pinia';
import { useStore } from '../stores/store';

export default {
    computed: {
        ...mapState(useStore, ["events"])
    }
}
</script>

<style scoped>
.logs-enter-active,
.logs-leave-active {
    transition-property: translate, opacity;
    transition-duration: 0.5s;
    transition-timing-function: ease;
}

.logs-enter-from {
    translate: 100px 0;
    opacity: 0;
}

.logs-leave-to {
    translate: -100px 0;
}

b {
    font-weight: bold;
}

.log-time,
.log-type,
.log-message {
    padding: 5px;
}

.log-type {
    vertical-align: bottom;
}

.log-time {
    font-weight: bold;
}

.log-message {
    font-family: 'Courier New', Courier, monospace;
}

.log-entry:hover {
    background: var(--accent-background);
}

.log-entry .extra-info {
    visibility: hidden;
    font-style: italic;
    text-align: right;
    float: right;
    margin-right: 10px;
}

.log-entry:hover .extra-info {
    visibility: visible;
}
</style>