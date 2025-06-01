import {moduleName} from "../sharedvision.js";
import {shareVision, disableAll} from "./misc.js";

export function pushControlButtons(controls) {
    if (!game.user.isGM) {
        return;
    }

    let isNewVersion = foundry.utils.isNewerVersion(game.version, "13.0")
    let enableSharedVisionObject = {
        name: "enableSharedVision",
        title: game.i18n.localize("SharedVision.CtrlBtn.Enable"),
        icon: "fas fa-globe",
        toggle: true,
        active: game.settings.get(moduleName, "enable"),
        visible: game.user.isGM,
        onClick: (value) => {
            shareVision(value);
        },
    };
    let disableAllSharedVisionObject = {
        name: "disableAllSharedVision",
        title: game.i18n.localize(
            "SharedVision.CtrlBtn.DisableAll",
        ),
        icon: "fas fa-eye-slash",
        toggle: true,
        active: game.settings.get(moduleName, "disableAll"),
        visible: game.user.isGM,
        onClick: (value) => {
            disableAll(value);
        },
    };

    if (isNewVersion) {
        applyForNewFoundryMenu(controls, enableSharedVisionObject, disableAllSharedVisionObject);
    } else {
        applyForLegacyFoundryMenu(controls, enableSharedVisionObject, disableAllSharedVisionObject);
    }
}

function applyForNewFoundryMenu(controls, enableSharedVisionObject, disableAllSharedVisionObject) {
    controls.tokens.tools.enableSharedVision = enableSharedVisionObject;
    controls.tokens.tools.disableAllSharedVision = disableAllSharedVisionObject;
}

function applyForLegacyFoundryMenu(controls, enableSharedVisionObject, disableAllSharedVisionObject) {
    let tokenButton = controls.find((b) => b.name == "token");

    if (tokenButton) {
        tokenButton.tools.push(
            enableSharedVisionObject,
            disableAllSharedVisionObject
        );
    }
}
