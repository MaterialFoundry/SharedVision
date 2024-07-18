import { initializeSources, onSetShareVision, revealTokenFog } from "./misc.js";
import { heyWait_onTrigger } from "./externalModules.js";
import { moveToken, updateAllTokens } from "./tokenLayer.js";

/*
 * Set up the socket used to communicate between GM and player clients
 */
export function socketInit() {
    game.socket.on(`module.SharedVision`, (payload) => {
        if (game.user == null) return;
        if (game.user.isGM == false && payload.msgType == "enable") {
            initializeSources(payload.newSource);
        } else if (game.user.isGM && payload.msgType == "userSet")
            onSetShareVision({ enable: payload.enable });
        else if (payload.msgType == "updateSight") {
            const token = canvas.tokens.placeables.find(
                (t) => t.id == payload.tokenId,
            );
            revealTokenFog(token);
            moveToken(token);
        }
    });

    game.socket.on("module.hey-wait", (payload) => {
        if (game.user == null) return;
        if (game.user.isGM) heyWait_onTrigger(payload.sceneId, payload.tileId);
    });
}

export function emitSharedVision(en, newSource = true) {
    const payload = {
        msgType: "enable",
        senderId: game.userId,
        enable: en,
        newSource: newSource,
    };
    game.socket.emit(`module.SharedVision`, payload);
}

export function userSet(en) {
    const payload = {
        msgType: "userSet",
        senderId: game.userId,
        enable: en,
    };
    game.socket.emit(`module.SharedVision`, payload);
}

export function updateSight(tokenId) {
    const payload = {
        msgType: "updateSight",
        senderId: game.userId,
        tokenId: tokenId,
    };
    game.socket.emit(`module.SharedVision`, payload);
}
