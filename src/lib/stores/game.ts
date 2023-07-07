import { writable } from 'svelte/store';

const rawGameEvents = [];

export const gameFrames = writable([]);

function mapGameEventToFrame(rawGameInfo, rawGameEvent) {
    console.assert(rawGameEvent.Type === 'frame');

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
            body: snake.Body.map(mapCoords),
            health: snake.Health,
            latency: snake.Latency
        }

    }

    return {
        width: rawGameInfo.Width,
        height: rawGameInfo.Height,
        turn: rawGameEvent.Data.Turn,
        snakes: rawGameEvent.Data.Snakes.map(mapSnake),
        food: rawGameEvent.Data.Food.map(mapCoords),
        hazards: rawGameEvent.Data.Hazards.map(mapCoords)
    }
};

// Fetch all relevant info from engine
export function loadGameStore(engineHost: string, gameID: string) {
    const infoHttpUrl = `https://${engineHost}/games/${gameID}`;
    const eventsWsUrl = `wss://${engineHost}/games/${gameID}/events`;

    console.debug(`[board] load game ${gameID} from ${engineHost}`);
    fetch(infoHttpUrl)
        .then((x) => x.json())
        .then((gameData) => {
            // gameInfo.set(mapGameInfo(gameData.Game));

            console.debug(`[board] opening game events websocket`);
            const ws = new WebSocket(eventsWsUrl);
            ws.onmessage = (event) => {
                const parsedEvent = JSON.parse(event.data);
                rawGameEvents.push(parsedEvent);

                if (parsedEvent.Type === 'frame') {
                    gameFrames.update($gameFrames => {
                        $gameFrames.push(mapGameEventToFrame(gameData.Game, parsedEvent));
                        $gameFrames.sort((a, b) => a.turn - b.turn);
                        return $gameFrames;
                    })
                } else if (parsedEvent.Type === 'game_end') {
                    console.debug('[board] closing game events websocket');
                    ws.close()
                }
            }
        });

};
