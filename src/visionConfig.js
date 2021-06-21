import {moduleName} from "../sharedvision.js";
import {initializeSources, compatibleCore} from "./misc.js";
import {emitSharedVision} from "./socket.js";

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
        return mergeObject(super.defaultOptions, {
            id: "sharedVisionConfig",
            title: `Shared Vision: Vision Config`,
            template: "./modules/SharedVision/templates/visionConfig.html",
            classes: ["sheet"]
        });
    }
  
    setActor(actor) {
      this.actor = actor;
    }
  
    /**
     * Provide data to the template
     */
    getData() {
        let btnEnable = this.actor.getFlag('SharedVision','enable');
        if (btnEnable == undefined) btnEnable = false;
        let hidden = this.actor.getFlag('SharedVision','hidden');
        let settings = this.actor.getFlag('SharedVision','userSetting');

        if (typeof(settings) === 'object') {
            settings = Object.values(settings);
        }
        
        const users = compatibleCore("0.8.5") ? game.users.contents : game.users.entities;
        let iteration = 0;
        for (let user of users){
            if (user.isGM) continue;
            let enable = false;
            if (settings != undefined && settings.length != undefined) 
            for (let setting of settings) 
                if (user.id == setting.id) {
                    enable = setting.enable;
                    break;
                }
            this.userSettings.push({
                name: user.name,
                id: user.id,
                enable,
                iteration
            })
            iteration++;
        }
        
        return {
            btnEnable,
            hidden,
            users: this.userSettings
        } 
    }
  
    /**
     * Update on form submit
     * @param {*} event 
     * @param {*} formData 
     */
    async _updateObject(event, formData) {
        await this.actor.setFlag('SharedVision','enable',formData.sharedVisionButton);
        await this.actor.setFlag('SharedVision','hidden',formData.sharedVisionHiddenButton);
        let newSettings = [];
        if (formData.sharedVision.length == undefined) {
            newSettings = [{id:this.userSettings[0].id, enable:formData.sharedVision}];
        }
        else {
            for (let i=0; i<formData.sharedVision.length; i++) {
                newSettings.push({id:this.userSettings[i].id, enable:formData.sharedVision[i]});
            }
        }
          
        await this.actor.setFlag('SharedVision','userSetting',newSettings);
        initializeSources();
        emitSharedVision(game.settings.get(moduleName,'enable'));
    }
  
    activateListeners(html) {
        super.activateListeners(html);
    }
}