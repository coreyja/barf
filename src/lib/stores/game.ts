import { writable } from 'svelte/store';

const rawGameEvents = [];

export const gameInfo = writable({});
export const gameFrames = writable([]);

function mapGameEventToFrame(e) {
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

// Fetch all relevant info from engine
export function loadGameStore(engineHost: string, gameID: string) {
    const infoHttpUrl = `https://${engineHost}/games/${gameID}`;
    const eventsWsUrl = `wss://${engineHost}/games/${gameID}/events`;

    console.debug(`[board] loading game ${gameID} from ${engineHost}`);

    fetch(infoHttpUrl)
        .then((x) => x.json())
        .then((gameData) => {
            gameInfo.set(gameData.Game);

            console.debug(`[board] opening game events websocket`);

            const ws = new WebSocket(eventsWsUrl);
            ws.onmessage = (event) => {
                const parsedEvent = JSON.parse(event.data);
                rawGameEvents.push(parsedEvent);

                if (parsedEvent.Type === 'frame') {
                    gameFrames.update($gameFrames => {
                        $gameFrames.push(mapGameEventToFrame(parsedEvent));
                        return $gameFrames;
                    })
                } else if (parsedEvent.Type === 'game_end') {
                    console.debug('[board] closing game events websocket');
                    ws.close()
                }
            }
        });

};
