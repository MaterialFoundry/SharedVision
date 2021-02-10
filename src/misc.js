import * as MODULE from "../sharedvision.js";
import * as SOCKET from "./socket.js";
import * as SETTINGS from "./settings.js";
import * as EXTERNAL from "./externalModules.js";

const old_isVisionSource = Token.prototype._isVisionSource;

export function onInit(){
    SETTINGS.registerSettings(); 
    SOCKET.socketInit();

    const triggerHappy = game.modules.get("trigger-happy");
    EXTERNAL.setTriggerHappyActive(triggerHappy != undefined && triggerHappy.active == true)

    const heyWait = game.modules.get("hey-wait");
    EXTERNAL.setHeyWaitActive(heyWait != undefined && heyWait.active == true)
}

export function onCanvasReady(){
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

export function onClosePermissionControl(permissionControl,html){
    const actor = permissionControl.object;
    if (actor.entity != "Actor") return;

    const enable = html.find("input[name = 'sharedVision']")[0].checked;

    actor.setFlag('SharedVision','enable',enable);
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
    if (enable)
      Token.prototype._isVisionSource = function patched_isVisionSource() {
        const result = old_isVisionSource.call(this);

        if (this.actor != null) {
            const sharedVision = this.actor.data.flags.SharedVision ? this.actor.data.flags.SharedVision.enable : false;
            if (sharedVision) return true;
        }
        return result;
    }
    else
      Token.prototype._isVisionSource = old_isVisionSource;
    
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

