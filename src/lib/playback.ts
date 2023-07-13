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
