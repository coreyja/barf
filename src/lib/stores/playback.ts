import { derived } from "svelte/store";
import { gameFrames } from "$lib/stores/game"


export const playbackReady = derived(gameFrames, ($gameFrames) => {
    // Ready for playback as long as we have one or more frames
    return $gameFrames.length > 0;
});
