import {moduleName} from "../sharedvision.js";
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
  if (compatibleCore("0.8.5")) canvas.perception.initialize();
  else canvas.initializeSources();
}

export function getPermission(entity,user,permissionLevel) {
  return entity.hasPerm(user, permissionLevel)
}

