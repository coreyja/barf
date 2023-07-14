export enum PlaybackState {
    PAUSED,
    PLAYING
}

export type PlaybackHandler = () => void;

export type PlaybackHandlers = {
    play: PlaybackHandler,
    pause: PlaybackHandler,
    next: PlaybackHandler,
    prev: PlaybackHandler,
    first: PlaybackHandler
}

let playbackInterval: undefined | ReturnType<typeof setInterval>;


export function startPlayback(fps: number, callback: () => boolean) {
    // Do nothing if playback is active
    if (playbackInterval) {
        return;
    }

    const delayMS = 1000 / Math.ceil(fps);
    playbackInterval = setInterval(() => {
        const continuePlayback = callback();
        if (!continuePlayback) {
            stopPlayback();
        }
    }, delayMS);
}

export function stopPlayback(): void {
    if (playbackInterval) {
        clearInterval(playbackInterval);
        playbackInterval = undefined;
    }
}
