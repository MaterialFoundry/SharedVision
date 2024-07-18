import { moduleName } from "../sharedvision.js";
import { initializeSources } from "./misc.js";
import { emitSharedVision } from "./socket.js";

export class visionConfig extends FormApplication {
    constructor(data, options) {
        super(data, options);
        this.actor;
        this.userSettings = [];
    }

    /**
     * Default Options for this FormApplication
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "sharedVision_visionConfig",
            title: `Shared Vision: Vision Config`,
            template: "./modules/SharedVision/templates/visionConfig.html",
            classes: ["sheet"],
        });
    }

    setActor(actor) {
        this.actor = actor;
    }

    /**
     * Provide data to the template
     */
    getData() {
        let btnEnable = this.actor.getFlag("SharedVision", "enable");
        if (btnEnable == undefined) btnEnable = false;
        let hidden = this.actor.getFlag("SharedVision", "hidden");
        let settings = this.actor.getFlag("SharedVision", "userSetting");

        if (typeof settings === "object") {
            settings = Object.values(settings);
        }

        const users = game.users.contents;
        let iteration = 0;
        for (let user of users) {
            if (user.isGM) continue;
            let token = false;
            let vision = false;
            let fog = false;
            if (settings != undefined && settings.length != undefined)
                for (let setting of settings)
                    if (user.id == setting.id) {
                        token = setting.token;
                        vision = setting.vision;
                        fog = setting.fog;
                        break;
                    }
            this.userSettings.push({
                name: user.name,
                id: user.id,
                token,
                vision,
                fog,
                iteration,
            });
            iteration++;
        }

        return {
            btnEnable,
            hidden,
            users: this.userSettings,
        };
    }

    /**
     * Update on form submit
     * @param {*} event
     * @param {*} formData
     */
    async _updateObject(event, formData) {
        await this.actor.setFlag(
            "SharedVision",
            "enable",
            formData.sharedVisionButton,
        );
        await this.actor.setFlag(
            "SharedVision",
            "hidden",
            formData.sharedVisionHiddenButton,
        );
        let newSettings = [];

        for (let user of this.userSettings) {
            newSettings.push({
                id: user.id,
                token: formData?.[`token-${user.id}`] === true,
                vision: formData?.[`vision-${user.id}`] === true,
                fog: formData?.[`fog-${user.id}`] === true,
            });
        }

        await this.actor.setFlag("SharedVision", "userSetting", newSettings);
        initializeSources();
        emitSharedVision(game.settings.get(moduleName, "enable"));
    }

    activateListeners(html) {
        super.activateListeners(html);
    }
}
