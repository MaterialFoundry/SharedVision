import { pushControlButtons } from "./src/controlButtons.js";
import {
    initializeSources,
    onSetShareVision,
    compatibleCore,
} from "./src/misc.js";
import {
    heyWait_onTileHud,
    setTriggerHappyActive,
    setHeyWaitActive,
} from "./src/externalModules.js";
import { visionConfig } from "./src/visionConfig.js";
import { libWrapper } from "./src/shim.js";
import { registerSettings, migrateSettings } from "./src/settings.js";
import { socketInit, emitSharedVision, updateSight } from "./src/socket.js";
import {
    isVisionSourceOverride,
    updateOcclusionOverride,
} from "./src/overrides.js";
import { updateToken } from "./src/tokenLayer.js";

export const moduleName = "SharedVision";
export let midiQOL;

//CONFIG.debug.hooks = true;

Hooks.once("init", function () {
    onInit();
});
Hooks.once("setup", function () {
    onSetup();
});
Hooks.once("ready", function () {
    onReady();
});
Hooks.on("getSceneControlButtons", (controls) => {
    pushControlButtons(controls);
}); //Register control button
Hooks.on("setSharedVision", (data) => {
    onSetShareVision(data);
});
Hooks.on("canvasReady", () => {
    onCanvasReady();
});
Hooks.on("updateToken", (data) => {
    onUpdateToken(data);
});
Hooks.on("sightRefresh", (data) => {
    onSightRefresh(data);
});
Hooks.on("renderTileHUD", async (tileHud, html) => {
    heyWait_onTileHud(tileHud, html);
});
Hooks.on("combatStart", () => {
    onCombat("start");
});
Hooks.on("deleteCombat", () => {
    onCombat("end");
});
Hooks.on("updateCombat", (a, b) => {
    onUpdateCombat(a, b);
});

function onInit() {
    registerSettings();
    socketInit();

    // Add Vision Permission sheet to ActorDirectory context options
    const ActorDirectory__getEntryContextOptions =
        ActorDirectory.prototype._getEntryContextOptions;
    ActorDirectory.prototype._getEntryContextOptions = function () {
        return ActorDirectory__getEntryContextOptions.call(this).concat([
            {
                name: "Shared Vision",
                icon: '<i class="fas fa-eye"></i>',
                condition: (li) => {
                    return game.user.isGM;
                },
                callback: (li) => {
                    let actor;

                    if(li.hasAttribute && li.hasAttribute('data-entry-id')) {
                        actor = game.actors.get(li.getAttribute('data-entry-id'));
                    } else {
                        actor = this.constructor.collection.get(li.data("documentId"));
                    }

                    if (actor) {
                        let dialog = new visionConfig();
                        dialog.setActor(actor);
                        dialog.render(true);
                    }
                },
            },
        ]);
    };

    setTimeout(function () {
        updateNotification();
    }, 500);
}

function onSetup() {
    const triggerHappy = game.modules.get("trigger-happy");
    setTriggerHappyActive(
        triggerHappy != undefined && triggerHappy.active == true,
    );
}

function onReady() {
    if (game.user.isGM) migrateSettings();

    const heyWait = game.modules.get("hey-wait");
    setHeyWaitActive(heyWait != undefined && heyWait.active == true);

    midiQOL = game.modules.get("midi-qol")?.active;
    if (midiQOL == undefined) midiQOL = false;
    if (
        midiQOL &&
        game.settings.settings.has("midi-qol.playerControlsInvisibleTokens")
    )
        midiQOL = game.settings.get(
            "midi-qol",
            "playerControlsInvisibleTokens",
        );

    if (game.modules.get("lib-wrapper")?.active) {
        libWrapper.register(
            "SharedVision",
            "Token.prototype._isVisionSource",
            isVisionSourceOverride,
            "OVERRIDE",
        );
        if (!compatibleCore("10.0"))
            libWrapper.register(
                "SharedVision",
                "ForegroundLayer.prototype.updateOcclusion",
                updateOcclusionOverride,
                "OVERRIDE",
            );
    } else {
        Token.prototype._isVisionSource = isVisionSourceOverride;
        if (!compatibleCore("10.0"))
            ForegroundLayer.prototype.updateOcclusion = updateOcclusionOverride;
    }

    if (!game.user.isGM) initializeSources();
}

let currentlyUpdatingToken;
let currentlyUpdatingTokenVisible = false;
let currentlyUpdatingTokenTimer;

function onUpdateToken(data) {
    emitSharedVision(game.settings.get(moduleName, "enable"), false);
    const token = compatibleCore("10.0")
        ? canvas.tokens.placeables.find((t) => t.id == data.id)
        : canvas.tokens.placeables.find((t) => t.id == data.data._id);

    currentlyUpdatingToken = compatibleCore("10.0") ? data.id : data.data._id;
    currentlyUpdatingTokenVisible = token?.visible;
    currentlyUpdatingTokenTimer = setTimeout(function () {
        updateToken(token);
        updateSight(currentlyUpdatingToken);
        currentlyUpdatingToken = undefined;
    }, 250);
}

function onSightRefresh(data) {
    clearTimeout(currentlyUpdatingTokenTimer);
    if (currentlyUpdatingToken != undefined && currentlyUpdatingTokenVisible)
        updateSight(currentlyUpdatingToken);
}

async function onCanvasReady() {
    if (midiQOL && game.modules.get("lib-wrapper")?.active == false) {
        Token.prototype._isVisionSource = isVisionSourceOverride;
    }

    const enable = game.settings.get(moduleName, "enable");
    if (game.user.isGM) emitSharedVision(enable);
    initializeSources();
}

function onCombat(mode) {
    if (game.user.isGM == false) return;
    const combatConfig = game.settings.get(moduleName, "combatConfig");
    if (Object.keys(combatConfig).length === 0) return;
    let data = {};
    let global = combatConfig[mode].global;
    if (global == "enable") data.globalSharedVision = true;
    else if (global == "disable") data.globalSharedVision = false;
    let disableAll = combatConfig[mode].disableAll;
    if (disableAll == "enable") data.disableAll = true;
    else if (disableAll == "disable") data.disableAll = false;

    onSetShareVision(data);
}

function onUpdateCombat(a, b) {
    if (a.previous.round == 0 && a.previous.turn == 0) onCombat("start");
}

function updateNotification() {
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
