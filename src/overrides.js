import {moduleName, midiQOL} from "../sharedvision.js";
import {getPermission} from "./misc.js";

let old_isVisionSource = Token.prototype._isVisionSource;

export function isVisionSourceOverride() {
    let result;
    if (midiQOL) result = isVisionSourceOverride_MidiQOLFix.call(this);
    else result = old_isVisionSource.call(this);
    if (result) return true;
  
    let sharedVision = false;
    if (game.user.isGM == false && this.actor != null) {
        if (this.data.hidden) {
            if ( (midiQOL && getPermission(this.actor,game.user, "OWNER")) == false && this.actor.data.flags.SharedVision?.hidden == false) return false;
        }
  
        if (game.settings.get(moduleName,'enable')) {
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
            sharedVision = (permission==0 && game.settings.get(moduleName,'none')) || (permission==1 && game.settings.get(moduleName,'limited')) || (permission==2 && game.settings.get(moduleName,'observer')) || (permission==3 && game.settings.get(moduleName,'owner'));
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
    if (this.data.hidden && !(isGM || getPermission(this.actor,game.user, "OWNER")))
        return false;
    
    // Always display controlled tokens which have vision
    if (this._controlled)
        return true;
    
    // Otherwise vision is ignored for GM users
    if (isGM)
        return false;
    if (getPermission(this.actor,game.user, "OWNER"))
        return true;

    // If a non-GM user controls no other tokens with sight, display sight anyways
    const canObserve = this.actor && getPermission(this.actor,game.user, "OBSERVER");
    if (!canObserve)
        return false;
    const others = canvas.tokens.controlled.filter(t => t.hasSight);

    //TP ** const others = this.layer.controlled.filter(t => !t.data.hidden && t.hasSight);
    return !others.length;
  }