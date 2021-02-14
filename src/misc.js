import * as MODULE from "../sharedvision.js";
import * as SOCKET from "./socket.js";
import * as SETTINGS from "./settings.js";
import * as EXTERNAL from "./externalModules.js";
import {libWrapper} from './shim.js';

let old_isVisionSource = Token.prototype._isVisionSource;
let midiQOL;

export function onInit(){
  SETTINGS.registerSettings(); 
  SOCKET.socketInit();

  const triggerHappy = game.modules.get("trigger-happy");
  EXTERNAL.setTriggerHappyActive(triggerHappy != undefined && triggerHappy.active == true)

  const heyWait = game.modules.get("hey-wait");
  EXTERNAL.setHeyWaitActive(heyWait != undefined && heyWait.active == true)

  midiQOL = game.modules.get('midi-qol')?.active;
  if (midiQOL && game.settings.settings.has('midi-qol.playerControlsInvisibleTokens')) midiQOL = game.settings.get('midi-qol','playerControlsInvisibleTokens');
  
  if(game.modules.get('lib-wrapper')?.active) 
    libWrapper.register("SharedVision", "Token.prototype._isVisionSource", isVisionSourceOverride, "OVERRIDE");
  else 
    Token.prototype._isVisionSource = isVisionSourceOverride;
}

function isVisionSourceOverride() {
  let result;
  if (midiQOL) result = isVisionSourceOverride_MidiQOLFix.call(this);
  else result = old_isVisionSource.call(this);
  if (result) return true;

  let sharedVision = false;
  if (game.user.isGM == false && this.actor != null) {
    if (game.settings.get(MODULE.moduleName,'enable')) {
      sharedVision = this.actor.data.flags.SharedVision != undefined ? this.actor.data.flags.SharedVision.enable : false; 
    }
    if (sharedVision == false) {
      const userSetting = this.actor.data.flags.SharedVision?.userSetting;
      if (userSetting != undefined) {
        for (let setting of userSetting)
          if (setting.id == game.userId) {
            sharedVision = setting.enable;
            break;
          }
      }
    }
    if (sharedVision == false) {
      const permission = this.actor.data.permission?.[game.userId] ? this.actor.data.permission?.[game.userId] : this.actor.data.permission.default;
      sharedVision = (permission==0 && game.settings.get(MODULE.moduleName,'none')) || (permission==1 && game.settings.get(MODULE.moduleName,'limited')) || (permission==2 && game.settings.get(MODULE.moduleName,'observer')) || (permission==3 && game.settings.get(MODULE.moduleName,'owner'));
    }
    return sharedVision;
  } 
  return result;
}

//Copied from Midi QOL's patching.js
function isVisionSourceOverride_MidiQOLFix() {
  // log("proxy _isVisionSource", this);
  if (!canvas.sight.tokenVision || !this.hasSight)
  return false;
  // Only display hidden tokens for the GM
  const isGM = game.user.isGM;
  // TP insert
  // console.error("is vision source ", this.actor?.name, this.actor?.hasPerm(game.user, "OWNER"))
  if (this.data.hidden && !(isGM || this.actor?.hasPerm(game.user, "OWNER")))
  return false;
  // Always display controlled tokens which have vision
  if (this._controlled)
  return true;
  // Otherwise vision is ignored for GM users
  if (isGM)
  return false;
  if (this.actor?.hasPerm(game.user, "OWNER"))
  return true;
  // If a non-GM user controls no other tokens with sight, display sight anyways
  const canObserve = this.actor && this.actor.hasPerm(game.user, "OBSERVER");
  if (!canObserve)
  return false;
  const others = canvas.tokens.controlled.filter(t => t.hasSight);
  //TP ** const others = this.layer.controlled.filter(t => !t.data.hidden && t.hasSight);
  return !others.length;
}

export async function onCanvasReady(){
    if(midiQOL && game.modules.get('lib-wrapper')?.active == false) {
      Token.prototype._isVisionSource = isVisionSourceOverride;
    }
    
    const enable = game.settings.get(MODULE.moduleName,'enable');
    if (game.user.isGM) SOCKET.emitSharedVision(enable);
    else initializeSources();
}

export function onRenderPermissionControl(permissionControl,html){
    const actor = permissionControl.object;
    if (actor.entity != "Actor") return;
    let btnEnable = actor.getFlag('SharedVision','enable');
    if (btnEnable == undefined) btnEnable = false;
    let userSetting = actor.getFlag('SharedVision','userSetting');
  
    let contents = `
      <hr>
      <p class="notes">${game.i18n.localize("SharedVision.ActorConf.Global.Note")}</p>
      <div class="form-group">
        <label>${game.i18n.localize("SharedVision.ActorConf.Global.Label")}</label>
        <input id="sharedVisionButton" type="checkbox" name="sharedVisionButton" data-dtype="Boolean" ${btnEnable ? 'checked' : ''}>
      </div>
      <hr>
      <p class="notes">${game.i18n.localize("SharedVision.ActorConf.User.Note")}</p>
      
    `
    const users = game.users.entities;
    for (let user of users){
      if (user.isGM) continue;
      let enable = false;
      if (userSetting != undefined) 
        for (let setting of userSetting) 
          if (user.id == setting.id) {
            enable = setting.enable;
            break;
          }

      contents += `
      <div class="form-group">
          <label>${user.name}</label>
          <input id="sharedVision-${user.id}" type="checkbox" name="sharedVision-${user.id}" data-dtype="Boolean" ${enable ? 'checked' : ''}>
        </div>
      `
    }

    html.find("button[name = 'submit']").before(contents);
    const element = document.getElementById("permission");
    element.style.height = "";
}

export async function onClosePermissionControl(permissionControl,html){
    const actor = permissionControl.object;
    if (actor.entity != "Actor") return;

    const btnEnable = html.find("input[name = 'sharedVisionButton']")[0].checked;

    await actor.setFlag('SharedVision','enable',btnEnable);

    let userSetting = [];
    const users = game.users.entities;
    for (let user of users){
      if (user.isGM) continue;
      const enable = html.find("input[name = 'sharedVision-"+user.id+"']")[0].checked;
      userSetting.push({id:user.id, enable:enable});
    }

    await actor.setFlag('SharedVision','userSetting',userSetting);

    initializeSources();
    SOCKET.emitSharedVision(game.settings.get(MODULE.moduleName,'enable'));
}

export function onSetShareVision(data){
    if (game.user.isGM == false) return;
    let enable;
    if (data.enable == true) enable = true;
    else if (data.enable == false) enable = false;
    else if (data.enable == 'toggle') enable = !game.settings.get(MODULE.moduleName,'enable');
    if (enable != game.settings.get(MODULE.moduleName,'enable')) {
        shareVision(enable);
        ui.controls.controls.find(controls => controls.name == "token").tools.find(tools => tools.name == "enableSharedVision").active = enable;
        ui.controls.render();
    }
}

export async function shareVision(en) {
    await game.settings.set(MODULE.moduleName,'enable',en);
    SOCKET.emitSharedVision(en);
    Hooks.call("ShareVision",{enable:en});
}
  
export function initializeSources(){
  canvas.initializeSources();
}

