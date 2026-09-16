import { moduleName, midiQOL } from "../sharedvision.js";
import { getPermission, isSharedVision } from "./misc.js";

export function isVisionSourceOverride(wrapped, ...args) {
    const result = typeof wrapped === "function" ? wrapped(...args) : false;
    if (result) return true;
    return isSharedVision(this) === true;
}

let patched = false;

export function patchIsVisionSource() {
    if (patched) return;
    patched = true;
    const proto = CONFIG.Token.objectClass.prototype;
    const previous = proto._isVisionSource;
    proto._isVisionSource = function (...args) {
        return isVisionSourceOverride.call(this, previous.bind(this), ...args);
    };
}

//Copied from Midi QOL's patching.js
function isVisionSourceOverride_MidiQOLFix() {
    // log("proxy _isVisionSource", this);
    if (!canvas.sight.tokenVision || !this.hasSight) return false;

    // Only display hidden tokens for the GM
    const isGM = game.user.isGM;

    // TP insert
    if (this.data.hidden && !(isGM || getPermission(this.actor, "OWNER")))
        return false;

    // Always display controlled tokens which have vision
    if (this._controlled) return true;

    // Otherwise vision is ignored for GM users
    if (isGM) return false;
    //if (getPermission(this.actor, "OWNER"))
    // return true;

    // If a non-GM user controls no other tokens with sight, display sight anyways
    const canObserve = this.actor && getPermission(this.actor, "OBSERVER");
    if (!canObserve) return false;
    const others = canvas.tokens.controlled.filter((t) => t.hasSight);

    //TP ** const others = this.layer.controlled.filter(t => !t.data.hidden && t.hasSight);
    return !others.length;
}

//Override of ForegroundLayer.prototype.updateOcclusion
export function updateOcclusionOverride() {
    let tokens = [];

    if (game.user.isGM) tokens = canvas.tokens.controlled;
    else {
        const allTokens = canvas.tokens.children[0].children;
        for (let token of allTokens)
            if (token.isOwner || isSharedVision(token)) tokens.push(token);
    }

    this._drawOcclusionShapes(tokens);
    this.occlusionMask.roofs.removeChildren();
    for (let tile of this.tiles) {
        tile.updateOcclusion(tokens);
        if (tile.isRoof && (tile.occluded || !this.displayRoofs)) {
            const s = tile.getRoofSprite();
            if (!s) continue;
            s.tint = 0x0000ff;
            this.occlusionMask.roofs.addChild(s);
        }
    }
}
