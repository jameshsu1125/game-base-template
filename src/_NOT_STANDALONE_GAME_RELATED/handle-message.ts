import { game } from "..";
import { MATCH_FIGHT_GAME_NAME } from "../configs/constants/constants";

export const RECEIVE_ACTIONS = {
    CHANGE_GAME_ASSETS: "CHANGE_GAME_ASSETS",
} as const;

// Adcreative.ai client sends reload event to the game

// its actually GameBuilderKey, but for repository requirements, we are not gonna import it
// To start that project as standalone, we shouldn't need GameBuilderKey
export const handleMessage = (event: MessageEvent) => {
    RECEIVE_CHANGE_GAME_ASSETS_MESSAGE(event, () => {
        console.log("Received CHANGE_GAME_ASSETS", event.data.overrides);
        if (event.data.overrides) {
            localStorage.setItem(
                MATCH_FIGHT_GAME_NAME,
                JSON.stringify(event.data.overrides)
            );
            console.log("Broadcasting change to all tabs");
            // Broadcast the change to all tabs
            window.postMessage(
                {
                    type: "GAME_ACTION",
                    action: "CHANGE_GAME_ASSETS_CALLBACK",
                },
                "*"
            );
        }
    });
};
export const RECEIVE_CHANGE_GAME_ASSETS_MESSAGE = (
    event: MessageEvent,
    callback: () => void
) => {
    if (
        event.data.type === "GAME_ACTION" &&
        event.data.action === RECEIVE_ACTIONS.CHANGE_GAME_ASSETS
    ) {
        callback();
    }
};
export function listenMessagesForChangingAssets() {
    window.addEventListener("message", handleMessage);

    // Clean up function for when the game is destroyed
    window.addEventListener("beforeunload", () => {
        window.removeEventListener("message", handleMessage);
        if (game) {
            game.destroy(true);
        }
    });
}

