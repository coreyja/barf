import { derived } from "svelte/store";
import { gameEvents } from "$lib/stores/game"

function mapGameEventToPlaybackFrame(e) {
    console.assert(e.Type === 'frame');

    const mapCoords = function (coords) {
        return { x: coords.X, y: coords.Y };
    }

    const mapSnake = function (snake) {
        return {
            // Fixed properties
            id: snake.ID,
            name: snake.Name,
            author: snake.Author,
            color: snake.Color,
            head: snake.HeadType,
            tail: snake.TailType,
            // Frame specific
            health: snake.Health,
            latency: snake.Latency
        }

    }

    return {
        turn: e.Data.Turn,
        snakes: e.Data.Snakes.map(mapSnake),
        food: e.Data.Food.map(mapCoords),
        hazards: e.Data.Hazards.map(mapCoords)
    }
};

export const playbackFrames = derived(gameEvents, ($gameEvents) => {
    const frames = $gameEvents
        .filter(e => e.Type === 'frame')
        .map(mapGameEventToPlaybackFrame);
    frames.sort((a, b) => a.turn - b.turn);
    return frames;
});
