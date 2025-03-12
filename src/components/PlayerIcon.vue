<template>
    <img v-if="player" :src="'https://crafatar.com/avatars/' + player.uuid + '?size=' + size + '&overlay=true'"
         class="player-icon" :title="player.username" :alt="player.username" :width="size" :height="size"/>
    <span v-else class="player-icon icon-not-found" :style="'--size: ' + size + 'px'">?</span>
</template>

<script>
export default {
    props: ["player", "size"]
}
</script>

<style scoped>
img.player-icon {
    /* Disable nearest-neighbor (blurry) image upscaling */
    image-rendering: -moz-crisp-edges;
    image-rendering: pixelated;
}

.icon-not-found {
    display: inline-block;
    text-align: center;
    align-content: center;
    background: #cbcbcb;
    width: var(--size);
    height: var(--size);
}
</style>