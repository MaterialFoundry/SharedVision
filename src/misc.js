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
  if (midiQOL) midiQOL = game.settings.get('midi-qol','playerControlsInvisibleTokens');
  
  if(game.modules.get('lib-wrapper')?.active) 
    libWrapper.register("SharedVision", "Token.prototype._isVisionSource", isVisionSourceOverride, "OVERRIDE");
  else 
    Token.prototype._isVisionSource = isVisionSourceOverride;
}

function isVisionSourceOverride() {
  let result;
  if (midiQOL) result = isVisionSourceOverride_MidiQOLFix.call(this);
  else result = old_isVisionSource.call(this);

  if (game.user.isGM == false && this.actor != null && game.settings.get(MODULE.moduleName,'enable')) {
      const sharedVision = this.actor.data.flags.SharedVision ? this.actor.data.flags.SharedVision.enable : false;
      if (sharedVision) return true;
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
    else setShareVision(enable);
}

export function onRenderPermissionControl(permissionControl,html){
    const actor = permissionControl.object;
    if (actor.entity != "Actor") return;
    let enable = actor.getFlag('SharedVision','enable');
    if (enable == undefined) enable = false;
  
    const contents = `
      <hr>
      <div class="form-group">
        <label>Enable Shared Vision</label>
        <input id="sharedVision" type="checkbox" name="sharedVision" data-dtype="Boolean" ${enable ? 'checked' : ''}>
      </div>
    `
  
    html.find("button[name = 'submit']").before(contents);
    const element = document.getElementById("permission");
    element.style.height = "";
}

export async function onClosePermissionControl(permissionControl,html){
    const actor = permissionControl.object;
    if (actor.entity != "Actor") return;

    const enable = html.find("input[name = 'sharedVision']")[0].checked;

    await actor.setFlag('SharedVision','enable',enable);
    if (game.settings.get(MODULE.moduleName,'enable')){
      setShareVision(true);
      SOCKET.emitSharedVision(true);
    }
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
  
export async function setShareVision(enable){
    const tokens = canvas.tokens.children[0].children;
    for (let t of tokens) 
      t.updateSource();
    const token = canvas.tokens.ownedTokens[0];
    if (token != undefined) {
      const lightAngle = token.lightAngle;
      await token.update({lightAngle:(lightAngle+0.0001)})
      await token.update({lightAngle:lightAngle})
    }
  }

