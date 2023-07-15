import { writable } from "svelte/store"

const DEFAULT_AUTOPLAY = false;
const DEFAULT_FPS = 6;
const DEFAULT_SHOW_COORDS = false;

// Storage helpers
function load(key: string, defaultValue) {
    const val = localStorage.getItem(`setting.${key}`)
    if (val) {
        return JSON.parse(val);
    }
    return defaultValue
}

function store(key: string, value) {
    localStorage.setItem(`setting.${key}`, JSON.stringify(value));
}

// FPS
export const fps = writable<number>(load('fps', DEFAULT_FPS));
fps.subscribe((value: number) => {
    store('fps', value);
})

// Autoplay
export const autoplay = writable<boolean>(load('autoplay', DEFAULT_AUTOPLAY));
autoplay.subscribe((value: boolean) => {
    store('autoplay', value)
});

// Show Coordinates
export const showCoords = writable<boolean>(load('showCoords', DEFAULT_SHOW_COORDS));
showCoords.subscribe((value: boolean) => {
    store('showCoords', value);
});
