import * as CBUTTONS from "./src/controlButtons.js";
import * as MISC from "./src/misc.js";
import * as EXTERNAL from "./src/externalModules.js";
import * as SOCKET from "./src/socket.js";

export const moduleName = "SharedVision";

Hooks.once('init', function()                                         { MISC.onInit() });
Hooks.on('getSceneControlButtons', (controls)                     =>  { CBUTTONS.pushControlButtons(controls) });  //Register control button
Hooks.on('renderPermissionControl', (permissionControl,html,data) =>  { MISC.onRenderPermissionControl(permissionControl,html) });
Hooks.on('closePermissionControl', (permissionControl,html)       =>  { MISC.onClosePermissionControl(permissionControl,html) });
Hooks.on('setShareVision',(data)                                  =>  { MISC.onSetShareVision(data) });
Hooks.on('canvasReady',()                                         =>  { MISC.onCanvasReady() });
Hooks.on('updateToken',()                                         =>  { SOCKET.emitSharedVision(game.settings.get(moduleName,'enable'))});

Hooks.on('controlToken',(token,controlled)                        =>  { EXTERNAL.triggerHappy_ControlToken(token,controlled) });
Hooks.on('preUpdateToken',(scene, embedded, update)               =>  { EXTERNAL.triggerHappy_onPreUpdateToken(scene, embedded, update) });
Hooks.on('renderTileHUD', async (tileHud, html)                   =>  { EXTERNAL.heyWait_onTileHud(tileHud,html) });

