import { writable } from 'svelte/store';

export const gameEvents = writable([]);

export function loadGameStore(engine: string, gameID: string) {
    const wsURL = `wss://${engine}/games/${gameID}/events`
    console.debug(`[board] loading game data from ${wsURL}`)

    const ws = new WebSocket(wsURL);
    ws.onmessage = (event) => {
        const parsedEvent = JSON.parse(event.data);
        gameEvents.update(items => {
            items.push(parsedEvent);
            return items;
        });

        if (parsedEvent.Type === "game_end") {
            console.debug('[board] closing websocket');
            ws.close()
        }
    }
}
