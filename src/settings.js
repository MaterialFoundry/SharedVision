import {moduleName} from "../sharedvision.js";
import {initializeSources} from "./misc.js";

/*
 * Initialize all settings
 */
export const registerSettings = function() {
  //Create the Help button
  game.settings.registerMenu(moduleName, 'helpMenu',{
    name: "SharedVision.Sett.Help",
    label: "SharedVision.Sett.Help",
    type: helpMenu,
    restricted: true
  });

  game.settings.register(moduleName,'none', {
    name: "SharedVision.Sett.None.Name",
    hint: "SharedVision.Sett.None.Hint",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: x => initializeSources()
  });

  game.settings.register(moduleName,'limited', {
    name: "SharedVision.Sett.Limited.Name",
    hint: "SharedVision.Sett.Limited.Hint",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: x => initializeSources()
  });

  game.settings.register(moduleName,'observer', {
    name: "SharedVision.Sett.Observer.Name",
    hint: "SharedVision.Sett.Observer.Hint",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: x => initializeSources()
  });

  game.settings.register(moduleName,'owner', {
    name: "SharedVision.Sett.Owner.Name",
    hint: "SharedVision.Sett.Owner.Hint",
    scope: "world",
    config: true,
    default: false,
    type: Boolean,
    onChange: x => initializeSources()
  });


  game.settings.register(moduleName,'enable', {
    scope: "world",
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(moduleName,'midiQOL-dialog', {
    scope: "world",
    config: false,
    default: false,
    type: Boolean,
  });

  game.settings.register(moduleName,'updateNotificationV1.0.4', {
    scope: "world",
    config: false,
    default: false,
    type: Boolean,
  });
}

export class helpMenu extends FormApplication {
  constructor(data, options) {
      super(data, options);
  }

  /**
   * Default Options for this FormApplication
   */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: "helpMenu",
      title: "Shared Vision: "+game.i18n.localize("SharedVision.Sett.Help"),
      template: "./modules/SharedVision/templates/helpMenu.html",
      width: "500px"
    });
  }

  /**
   * Provide data to the template
   */
  getData() {
      return {
         
      } 
  }

  /**
   * Update on form submit
   * @param {*} event 
   * @param {*} formData 
   */
  async _updateObject(event, formData) {

  }

  activateListeners(html) {
    super.activateListeners(html);  
  }
}

