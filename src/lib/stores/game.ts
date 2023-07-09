import { writable } from 'svelte/store';

export type Point = {
    x: number,
    y: number
}

export type Snake = {
    id: string,
    name: string,
    author: string,
    color: string,
    head: string,
    tail: string,
    health: number,
    latency: number,
    body: Point[],
    isEliminated: boolean
}

export type Frame = {
    turn: number,
    width: number,
    height: number,
    snakes: Snake[],
    food: Point[],
    hazards: Point[]
}


const rawGameEvents = [];

export const gameFrames = writable([]);

function rawFrameEventToFrame(rawGameInfo, rawFrameEvent): Frame {
    console.assert(rawFrameEvent.Type === 'frame');

    const rawCoordsToPoint = function (coords): Point {
        return { x: coords.X, y: coords.Y };
    }

    const rawSnakeToSnake = function (rawSnake): Snake {
        return {
            // Fixed properties
            id: rawSnake.ID,
            name: rawSnake.Name,
            author: rawSnake.Author,
            color: rawSnake.Color,
            head: rawSnake.HeadType,
            tail: rawSnake.TailType,
            // Frame specific
            health: rawSnake.Health,
            latency: rawSnake.Latency,
            body: rawSnake.Body.map(rawCoordsToPoint),
            isEliminated: rawSnake.Death != null
        }

    }

    return {
        turn: rawFrameEvent.Data.Turn,
        width: rawGameInfo.Width,
        height: rawGameInfo.Height,
        snakes: rawFrameEvent.Data.Snakes.map(rawSnakeToSnake),
        food: rawFrameEvent.Data.Food.map(rawCoordsToPoint),
        hazards: rawFrameEvent.Data.Hazards.map(rawCoordsToPoint)
    }
};

// Fetch all relevant info from engine
export function loadGameStore(engineHost: string, gameID: string) {
    const infoHttpUrl = `https://${engineHost}/games/${gameID}`;
    const eventsWsUrl = `wss://${engineHost}/games/${gameID}/events`;

    console.debug(`[board] load game ${gameID} from ${engineHost}`);
    fetch(infoHttpUrl)
        .then((response) => response.json())
        .then((gameData) => {
            console.debug(`[board] opening game events websocket`);
            const ws = new WebSocket(eventsWsUrl);

            ws.onmessage = (wsEvent) => {
                const gameEvent = JSON.parse(wsEvent.data);
                rawGameEvents.push(gameEvent);

                if (gameEvent.Type === 'frame') {
                    gameFrames.update($gameFrames => {
                        $gameFrames.push(
                            rawFrameEventToFrame(gameData.Game, gameEvent)
                        );
                        $gameFrames.sort(
                            (a: Frame, b: Frame) => a.turn - b.turn
                        );
                        return $gameFrames;
                    })
                } else if (gameEvent.Type === 'game_end') {
                    console.debug('[board] closing game events websocket');
                    ws.close()
                }
            }
        });

};
