import {initializeSources} from "./misc.js";
import {heyWait_onTrigger} from "./externalModules.js";

/*
 * Set up the socket used to communicate between GM and player clients
 */
export function socketInit(){
    game.socket.on(`module.SharedVision`, (payload) =>{
        if (game.user.isGM == false && payload.msgType == "enable") initializeSources();
        else if (game.user.isGM && payload.msgType == "userSet") onSetShareVision({enable:payload.enable});
    }); 
    
    game.socket.on('module.hey-wait', (payload) =>{
        if (game.user.isGM) 
            heyWait_onTrigger(payload.sceneId,payload.tileId);
    });
}

export function emitSharedVision(en){
    const payload = {
        "msgType": "enable",
        "senderId": game.userId, 
        "enable": en
    };
    game.socket.emit(`module.SharedVision`, payload);
}

export function userSet(en){
    const payload = {
        "msgType": "userSet",
        "senderId": game.userId, 
        "enable": en
    };
    game.socket.emit(`module.SharedVision`, payload);
}