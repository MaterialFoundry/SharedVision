import {moduleName} from "../sharedvision.js";
import {userSet} from "./socket.js";
import {shareVision} from "./misc.js";

var triggerHappyActive;
var heyWaitActive;

export function setTriggerHappyActive(en){
  triggerHappyActive = en;
}

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




export function triggerHappy_onPreUpdateToken(scene, embedded, update, options, userId) {
  if (!scene.isView || triggerHappyActive == false) return true;
  if (update.x === undefined && update.y === undefined) return true;
  const token = scene.data.tokens.find(t => t._id === update._id);

  const position = {
    x: (update.x || token.x) + token.width * scene.data.grid / 2,
    y: (update.y || token.y) + token.height * scene.data.grid / 2
  };
  const movementTokens = canvas.tokens.placeables.filter(tok => tok.data._id !== token._id);
  const tokens = game.triggers._getPlaceablesAt(movementTokens, position);
  const drawings = game.triggers._getPlaceablesAt(canvas.drawings.placeables, position);
  if (tokens.length === 0 && drawings.length === 0) return true;
  const triggers = game.triggers._getTriggersFromTokens(game.triggers.triggers, tokens, 'move');
  triggers.push(...game.triggers._getTriggersFromDrawings(game.triggers.triggers, drawings, 'move'));

  if (triggers.length === 0) return true;

  for (let t of triggers) {
    const options = t.options;
    Hooks.once('updateToken', () => triggerHappy_AnalyzeOptions(options));
  }
}
  
export function triggerHappy_ControlToken(token,controlled){
  if (!controlled || triggerHappyActive == false) return;
  const tokens = [token];
  const triggers = game.triggers._getTriggersFromTokens(game.triggers.triggers, tokens, 'click');
  if (triggers.length === 0) return;
  const options = triggers[0].options;
  triggerHappy_AnalyzeOptions(options)
}
  
export function triggerHappy_AnalyzeOptions(options){
  for (let o of options) {
    if (o.includes('shareVision')) {
      let enable;
      const data = o.replace('shareVision=','');
      if (data == 'true') enable = true;
      else if (data == 'false') enable = false;
      else if (data == 'toggle') enable = !game.settings.get(moduleName,'enable');

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
  }
}