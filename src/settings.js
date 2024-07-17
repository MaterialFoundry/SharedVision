import { moduleName } from "../sharedvision.js";
import { initializeSources, compatibleCore } from "./misc.js";
import { emitSharedVision } from "./socket.js";

/*
 * Initialize all settings
 */
export const registerSettings = function () {
    //Create the Help button
    game.settings.registerMenu(moduleName, "helpMenu", {
        name: "SharedVision.Sett.Help",
        label: "SharedVision.Sett.Help",
        type: helpMenu,
        restricted: true,
    });

    game.settings.registerMenu(moduleName, "config", {
        name: "SharedVision.Conf.Title",
        label: "SharedVision.Conf.Title",
        type: configMenu,
        restricted: true,
    });

    game.settings.register(moduleName, "combatConfig", {
        scope: "world",
        config: false,
        default: {},
        type: Object,
    });

    game.settings.register(moduleName, "overrideConfig", {
        scope: "world",
        config: false,
        default: {},
        type: Object,
    });

    game.settings.register(moduleName, "enable", {
        scope: "world",
        config: false,
        default: false,
        type: Boolean,
    });

    game.settings.register(moduleName, "disableAll", {
        scope: "world",
        config: false,
        default: false,
        type: Boolean,
    });

    game.settings.register(moduleName, "midiQOL-dialog", {
        scope: "world",
        config: false,
        default: false,
        type: Boolean,
    });

    game.settings.register(moduleName, "migration_v1.0.10", {
        scope: "world",
        config: false,
        default: false,
        type: Boolean,
    });

    /////////////////////////////////////////////////
    //Remove all settings below this in next version
    /////////////////////////////////////////////////

    game.settings.register(moduleName, "none", {
        name: "SharedVision.Sett.None.Name",
        hint: "SharedVision.Sett.None.Hint",
        scope: "world",
        config: false,
        default: false,
        type: Boolean,
        onChange: (x) => initializeSources(),
    });

    game.settings.register(moduleName, "limited", {
        name: "SharedVision.Sett.Limited.Name",
        hint: "SharedVision.Sett.Limited.Hint",
        scope: "world",
        config: false,
        default: false,
        type: Boolean,
        onChange: (x) => initializeSources(),
    });

    game.settings.register(moduleName, "observer", {
        name: "SharedVision.Sett.Observer.Name",
        hint: "SharedVision.Sett.Observer.Hint",
        scope: "world",
        config: false,
        default: false,
        type: Boolean,
        onChange: (x) => initializeSources(),
    });

    game.settings.register(moduleName, "owner", {
        name: "SharedVision.Sett.Owner.Name",
        hint: "SharedVision.Sett.Owner.Hint",
        scope: "world",
        config: false,
        default: false,
        type: Boolean,
        onChange: (x) => initializeSources(),
    });

    game.settings.register(moduleName, "friendly", {
        name: "SharedVision.Sett.Friendly.Name",
        hint: "SharedVision.Sett.Friendly.Hint",
        scope: "world",
        config: false,
        default: false,
        type: Boolean,
        onChange: (x) => initializeSources(),
    });

    game.settings.register(moduleName, "neutral", {
        name: "SharedVision.Sett.Neutral.Name",
        hint: "SharedVision.Sett.Neutral.Hint",
        scope: "world",
        config: false,
        default: false,
        type: Boolean,
        onChange: (x) => initializeSources(),
    });

    game.settings.register(moduleName, "hostile", {
        name: "SharedVision.Sett.Hostile.Name",
        hint: "SharedVision.Sett.Hostile.Hint",
        scope: "world",
        config: false,
        default: false,
        type: Boolean,
        onChange: (x) => initializeSources(),
    });

    game.settings.register(moduleName, "secret", {
        name: "SharedVision.Sett.Secret.Name",
        hint: "SharedVision.Sett.Secret.Hint",
        scope: "world",
        config: false,
        default: false,
        type: Boolean,
        onChange: (x) => initializeSources(),
    });
};

export function migrateSettings() {
    if (!game.settings.get(moduleName, "migration_v1.0.10")) {
        console.log(
            "Shared Vision - Migrating Shared Vision settings to v1.0.10",
        );
        const actors = game.actors;
        for (let actor of actors) {
            console.log(`Shared Vision - Migrating actor: '${actor.name}'`);
            let settings = actor.getFlag("SharedVision", "userSetting");
            if (settings == undefined) continue;

            for (let setting of settings) {
                if (setting.enable) {
                    setting.token = true;
                    setting.vision = true;
                    setting.fog = true;
                    delete setting.enable;
                } else if (!setting.enable) {
                    delete setting.enable;
                }
            }
            actor.setFlag("SharedVision", "userSetting", settings);
        }
        console.log(`Shared Vision - Migrating settings`);
        const overrideConfig = {
            permission: {
                none: { vision: game.settings.get(moduleName, "none") },
                limited: { vision: game.settings.get(moduleName, "limited") },
                observer: { vision: game.settings.get(moduleName, "observer") },
                owner: { vision: game.settings.get(moduleName, "owner") },
            },
            disposition: {
                friendly: { vision: game.settings.get(moduleName, "friendly") },
                neutral: { vision: game.settings.get(moduleName, "neutral") },
                hostile: { vision: game.settings.get(moduleName, "hostile") },
                secret: { vision: game.settings.get(moduleName, "secret") },
            },
        };
        game.settings.set(moduleName, "overrideConfig", overrideConfig);
        game.settings.set(moduleName, "migration_v1.0.10", true);
        console.log("Shared Vision - Migration done");
    }
}

export class helpMenu extends FormApplication {
    constructor(data, options) {
        super(data, options);
    }

    /**
     * Default Options for this FormApplication
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "sharedVision_helpMenu",
            title:
                "Shared Vision: " +
                game.i18n.localize("SharedVision.Sett.Help"),
            template: "./modules/SharedVision/templates/helpMenu.html",
            width: "500px",
        });
    }

    /**
     * Provide data to the template
     */
    getData() {
        return {};
    }

    /**
     * Update on form submit
     * @param {*} event
     * @param {*} formData
     */
    async _updateObject(event, formData) {}

    activateListeners(html) {
        super.activateListeners(html);
    }
}

export function getOverridePermissions(level, type) {
    const overrideConfig = game.settings.get(moduleName, "overrideConfig");
    if (overrideConfig.permission == undefined) return false;
    let perm = overrideConfig?.permission[level];
    if (perm == undefined) perm = { vision: false, token: false, fog: false };
    if (type == undefined) return perm;
    return perm[type];
}

export function getOverrideDispositions(disposition, type) {
    const overrideConfig = game.settings.get(moduleName, "overrideConfig");
    if (overrideConfig.disposition == undefined) return false;
    let perm = overrideConfig?.disposition[disposition];
    if (perm == undefined) perm = { vision: false, token: false, fog: false };
    if (type == undefined) return perm;
    return perm[type];
}

export class configMenu extends FormApplication {
    constructor(data, options) {
        super(data, options);
        this.combatSettings = {};
    }

    /**
     * Default Options for this FormApplication
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: "sharedVision_config",
            title:
                "Shared Vision: " +
                game.i18n.localize("SharedVision.Conf.Title"),
            template: "./modules/SharedVision/templates/config.html",
            width: "500px",
        });
    }

    /**
     * Provide data to the template
     */
    getData() {
        let combatConfig = game.settings.get(moduleName, "combatConfig");
        if (combatConfig.start == undefined)
            combatConfig.start = { global: false, disableAll: false };
        if (combatConfig.end == undefined)
            combatConfig.end = { global: false, disableAll: false };

        let combat = {
            global: {
                name: game.i18n.localize(
                    "SharedVision.VisionConf.Global.Label",
                ),
                id: "global",
                start: combatConfig.start.global,
                end: combatConfig.end.global,
            },
            disableAll: {
                name: game.i18n.localize("SharedVision.CtrlBtn.DisableAll"),
                id: "disableAll",
                start: combatConfig.start.disableAll,
                end: combatConfig.end.disableAll,
            },
        };

        const permissions = [
            {
                id: "none",
                name: game.i18n.localize(
                    compatibleCore("10.0")
                        ? "OWNERSHIP.NONE"
                        : "PERMISSION.NONE",
                ),
                permissions: getOverridePermissions("none"),
            },
            {
                id: "limited",
                name: game.i18n.localize(
                    compatibleCore("10.0")
                        ? "OWNERSHIP.LIMITED"
                        : "PERMISSION.LIMITED",
                ),
                permissions: getOverridePermissions("limited"),
            },
            {
                id: "observer",
                name: game.i18n.localize(
                    compatibleCore("10.0")
                        ? "OWNERSHIP.OBSERVER"
                        : "PERMISSION.OBSERVER",
                ),
                permissions: getOverridePermissions("observer"),
            },
            {
                id: "owner",
                name: game.i18n.localize(
                    compatibleCore("10.0")
                        ? "OWNERSHIP.OWNER"
                        : "PERMISSION.OWNER",
                ),
                permissions: getOverridePermissions("owner"),
            },
        ];

        const dispositions = [
            {
                id: "friendly",
                name: game.i18n.localize(
                    compatibleCore("11.0")
                        ? "TOKEN.DISPOSITION.FRIENDLY"
                        : "TOKEN.FRIENDLY",
                ),
                permissions: getOverrideDispositions("friendly"),
            },
            {
                id: "neutral",
                name: game.i18n.localize(
                    compatibleCore("11.0")
                        ? "TOKEN.DISPOSITION.NEUTRAL"
                        : "TOKEN.NEUTRAL",
                ),
                permissions: getOverrideDispositions("neutral"),
            },
            {
                id: "hostile",
                name: game.i18n.localize(
                    compatibleCore("11.0")
                        ? "TOKEN.DISPOSITION.HOSTILE"
                        : "TOKEN.HOSTILE",
                ),
                permissions: getOverrideDispositions("hostile"),
            },
        ];
        if (compatibleCore("11.0")) {
            dispositions.push({
                id: "secret",
                name: game.i18n.localize("TOKEN.DISPOSITION.SECRET"),
                permissions: getOverrideDispositions("secret"),
            });
        }

        return {
            permissions,
            dispositions,
            combat,
        };
    }

    /**
     * Update on form submit
     * @param {*} event
     * @param {*} formData
     */
    async _updateObject(event, formData) {
        let config = {
            permission: {
                none: { vision: false, token: false, fog: false },
                limited: { vision: false, token: false, fog: false },
                observer: { vision: false, token: false, fog: false },
                owner: { vision: false, token: false, fog: false },
            },
            disposition: {
                friendly: { vision: false, token: false, fog: false },
                neutral: { vision: false, token: false, fog: false },
                hostile: { vision: false, token: false, fog: false },
                secret: { vision: false, token: false, fog: false },
            },
        };
        let combatConfig = {
            start: { global: false, disableAll: false },
            end: { global: false, disableAll: false },
        };
        for (const [key, value] of Object.entries(formData)) {
            const split = key.split("-");
            if (split[0] == "combatSelect") {
                combatConfig[split[1]][split[2]] = value;
            } else config[split[0]][split[2]][split[1]] = value;
        }
        await game.settings.set(moduleName, "overrideConfig", config);
        await game.settings.set(moduleName, "combatConfig", combatConfig);
        initializeSources();
        emitSharedVision(game.settings.get(moduleName, "enable"));
    }

    activateListeners(html) {
        super.activateListeners(html);
    }
}
