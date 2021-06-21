import {moduleName, midiQOL} from "../sharedvision.js";
import {emitSharedVision} from "./socket.js";

export function compatibleCore(compatibleVersion){
  let coreVersion = game.data.version;
  coreVersion = coreVersion.split(".");
  compatibleVersion = compatibleVersion.split(".");
  if (compatibleVersion[0] > coreVersion[0]) return false;
  if (compatibleVersion[1] > coreVersion[1]) return false;
  if (compatibleVersion[2] > coreVersion[2]) return false;
  return true;
}

export function onSetShareVision(data){
  if (game.user.isGM == false) return;
  let enable;
  if (data.enable == true) enable = true;
  else if (data.enable == false) enable = false;
  else if (data.enable == 'toggle') enable = !game.settings.get(moduleName,'enable');
  if (enable != game.settings.get(moduleName,'enable')) {
    shareVision(enable);
    ui.controls.controls.find(controls => controls.name == "token").tools.find(tools => tools.name == "enableSharedVision").active = enable;
    ui.controls.render();
  }
}

export async function shareVision(en) {
  await game.settings.set(moduleName,'enable',en);
  emitSharedVision(en);
  Hooks.call("ShareVision",{enable:en});
}
  
export function initializeSources(){
  if (compatibleCore("0.8.5")) {
    //canvas.perception.initialize();
    canvas.perception.initialize({
      sight: {initialize: true, refresh: true},
      lighting: {refresh: true},
      sounds: {refresh: true},
      foreground: {refresh: true}
    });
  }
  else canvas.initializeSources();
}

export function getPermission(entity,user,permissionLevel) {
  return entity.hasPerm(user, permissionLevel)
}

export function isSharedVision(token) {
  let sharedVision = false;
  if (game.user.isGM == false && token.actor != null) {
      if (token.data.hidden) {
          if ( (midiQOL && getPermission(token.actor,game.user, "OWNER")) == false && token.actor.data.flags.SharedVision?.hidden == false) return false;
      }

      if (game.settings.get(moduleName,'enable')) {
          sharedVision = token.actor.data.flags.SharedVision != undefined ? token.actor.data.flags.SharedVision.enable : false; 
      }

      if (sharedVision == false) {
          let userSetting = token.actor.data.flags.SharedVision?.userSetting;
          if (typeof(userSetting) === 'object') {
            userSetting = Object.values(userSetting);
        }
          if (userSetting != undefined) {
              for (let setting of userSetting)
                  if (setting.id == game.userId) {
                      sharedVision = setting.enable;
                      break;
                  }
          }
      }
      
      if (sharedVision == false) {
          const permission = token.actor.data.permission?.[game.userId] ? token.actor.data.permission?.[game.userId] : token.actor.data.permission.default;
          sharedVision = (permission==0 && game.settings.get(moduleName,'none')) || (permission==1 && game.settings.get(moduleName,'limited')) || (permission==2 && game.settings.get(moduleName,'observer')) || (permission==3 && game.settings.get(moduleName,'owner'));
      }
      return sharedVision;
  } 
}

