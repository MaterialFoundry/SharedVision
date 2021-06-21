import {pushControlButtons} from "./src/controlButtons.js";
import {initializeSources, onSetShareVision, compatibleCore} from "./src/misc.js";
import {triggerHappy_ControlToken, triggerHappy_onPreUpdateToken, heyWait_onTileHud, setTriggerHappyActive, setHeyWaitActive} from "./src/externalModules.js";
import {visionConfig} from './src/visionConfig.js';
import {libWrapper} from './src/shim.js';
import {registerSettings} from "./src/settings.js";
import {socketInit, emitSharedVision} from "./src/socket.js";
import {isVisionSourceOverride,updateOcclusionOverride} from './src/overrides.js';

export const moduleName = "SharedVision";
export let midiQOL;

Hooks.once('init', function()                                         { onInit() });
Hooks.on('getSceneControlButtons', (controls)                     =>  { pushControlButtons(controls) });  //Register control button
Hooks.on('setShareVision',(data)                                  =>  { onSetShareVision(data) });
Hooks.on('canvasReady',()                                         =>  { onCanvasReady() });
Hooks.on('updateToken',()                                         =>  { emitSharedVision(game.settings.get(moduleName,'enable'))});

Hooks.on('controlToken',(token,controlled)                        =>  { triggerHappy_ControlToken(token,controlled) });
Hooks.on('preUpdateToken',(scene, embedded, update)               =>  { triggerHappy_onPreUpdateToken(scene, embedded, update) });
Hooks.on('renderTileHUD', async (tileHud, html)                   =>  { heyWait_onTileHud(tileHud,html) });

function onInit(){
    registerSettings(); 
    socketInit();
  
    const triggerHappy = game.modules.get("trigger-happy");
    setTriggerHappyActive(triggerHappy != undefined && triggerHappy.active == true)
  
    const heyWait = game.modules.get("hey-wait");
    setHeyWaitActive(heyWait != undefined && heyWait.active == true)
  
    midiQOL = game.modules.get('midi-qol')?.active;
    if (midiQOL == undefined) midiQOL = false;
    if (midiQOL && game.settings.settings.has('midi-qol.playerControlsInvisibleTokens')) 
        midiQOL = game.settings.get('midi-qol','playerControlsInvisibleTokens');
    
    if(game.modules.get('lib-wrapper')?.active) {
        libWrapper.register("SharedVision", "Token.prototype._isVisionSource", isVisionSourceOverride, "OVERRIDE");
        if (compatibleCore('0.8.6')) libWrapper.register("SharedVision", "ForegroundLayer.prototype.updateOcclusion", updateOcclusionOverride, "OVERRIDE");
    }
        
    else {
        Token.prototype._isVisionSource = isVisionSourceOverride;
        if (compatibleCore('0.8.6')) ForegroundLayer.prototype.updateOcclusion = updateOcclusionOverride;
    }
      
  
    // Add Vision Permission sheet to ActorDirectory context options
    const ActorDirectory__getEntryContextOptions = ActorDirectory.prototype._getEntryContextOptions;
    ActorDirectory.prototype._getEntryContextOptions = function () {
        return ActorDirectory__getEntryContextOptions.call(this).concat([
            {
                name: "Shared Vision",
                icon: '<i class="fas fa-eye"></i>',
                condition: (li) => {
                    return game.user.isGM;
                },
                callback: (li) => {
                    const actor = this.constructor.collection.get(li.data("entityId"));
                    if (actor) {
                        let dialog = new visionConfig();
                        dialog.setActor(actor);
                        dialog.render(true);
                    }
                },
            },
        ]);
    };

    setTimeout(function(){
        updateNotification();
    },500)
    
}

async function onCanvasReady(){
    if(midiQOL && game.modules.get('lib-wrapper')?.active == false) {
        Token.prototype._isVisionSource = isVisionSourceOverride;
    }
    
    const enable = game.settings.get(moduleName,'enable');
    if (game.user.isGM) emitSharedVision(enable);
    else initializeSources();
}

function updateNotification(){
    /*
    if (game.settings.get(moduleName,"updateNotificationV1.0.4") == false && game.user.isGM) {
      let d = new Dialog({
        title: "Shared Vision update v1.0.4",
        content: `
        <h3>Shared Vision has been updated to version 1.0.4</h3>
        <p>
        The vision configuration has been removed from the actor permission configuration screen. Instead, it now has its own configuration screen.<br>
        You can find this by right-clicking an actor in the Actors Directory, and selection 'Shared Vision'.
        <br>
        <input type="checkbox" name="hide" data-dtype="Boolean">
        Don't show this screen again
        </p>`,
        buttons: {
        ok: {
          icon: '<i class="fas fa-check"></i>',
          label: "OK"
        }
        },
        default: "OK",
        close: html => {
          if (html.find("input[name ='hide']").is(":checked")) game.settings.set(moduleName,"updateNotificationV1.0.4",true);
        }
      });
      d.render(true);
    }
    */
  }