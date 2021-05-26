import {moduleName} from "../sharedvision.js";
import {shareVision} from "./misc.js";

export function pushControlButtons(controls) {
    if (game.user.isGM) {
        let tokenButton = controls.find(b => b.name == "token")
        if (tokenButton) {
            tokenButton.tools.push({
                name: "enableSharedVision",
                title: game.i18n.localize("SharedVision.CtrlBtn.Enable"),
                icon: "fas fa-eye",
                toggle: true,
                active: game.settings.get(moduleName,'enable'),
                visible: game.user.isGM,
                onClick: (value) => {
                    shareVision(value);
                }
            });
        }
    }
}