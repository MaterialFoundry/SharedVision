import {moduleName} from "../sharedvision.js";
import {userSet} from "./socket.js";
import {shareVision} from "./misc.js";

var triggerHappyActive;
var heyWaitActive;

export function setTriggerHappyActive(en){
  triggerHappyActive = en;

  if (en) game.triggers.registerEffect('SharedVision');
}

Hooks.on('TriggerHappy', (key, args) => {
  if (key == 'SharedVision') {
    let enable;
    if (args == 'enable') enable = true;
    else if (args == 'disable') enable = false;
    else if (args == 'toggle') enable = !game.settings.get(moduleName,'enable');
    if (enable != game.settings.get(moduleName,'enable')) {
      if (game.user.isGM){
        shareVision(enable);
        ui.controls.controls.find(controls => controls.name == "token").tools.find(tools => tools.name == "enableSharedVision").active = enable;
        ui.controls.render();
      }
      else
        userSet(enable);
    }
  }
})

export function setHeyWaitActive(en){
  heyWaitActive = en;
}

export function heyWait_onTrigger(sceneId,tileId) {
  if (game.user.isGM == false || heyWaitActive == false) return;

  const tiles = canvas.tiles.children[0].children;
  let tile;
  for (let t of tiles) {
    if (t.id == tileId) {
      tile = t;
      break;
    }
  }

  let enable = false;
  if (tile.data?.flags?.['sharedVision']?.enabled) enable = tile.data?.flags?.['sharedVision']?.enabled;

  if (enable != game.settings.get(moduleName,'enable')) {
    shareVision(enable);
    ui.controls.controls.find(controls => controls.name == "token").tools.find(tools => tools.name == "enableSharedVision").active = enable;
    ui.controls.render();
  }
}

export function heyWait_onTileHud(tileHud,html){
  if (game.user.isGM == false || heyWaitActive == false) return;
  const tile = tileHud.object;

  if (!tile.data?.flags?.['hey-wait']?.enabled) {
    return;
  } 

  let enabled = false;
  if (tile.data?.flags?.['sharedVision']?.enabled) enabled = tile.data?.flags?.['sharedVision']?.enabled;

  const title = game.i18n.localize('SharedVision.CtrlBtn.Enable');
  const active = enabled ? 'active' : '';

  const form = `
    <div class="control-icon sharedVisionEnabled ${active}">
      <i class="fas fa-eye" title="${title}">
    </div>
  `;
  
  html.find('.visibility').before(form);
  html.find('.sharedVisionEnabled').click(async () => {
    tile.data.flags['sharedVision'] = {enabled:!enabled};
    tileHud.render();
  });
}