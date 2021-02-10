import * as MODULE from "../sharedvision.js";

/*
 * Initialize all settings
 */
export const registerSettings = function() {
  //Create the Help button
  game.settings.registerMenu(MODULE.moduleName, 'helpMenu',{
    name: "SharedVision.Sett.Help",
    label: "SharedVision.Sett.Help",
    type: helpMenu,
    restricted: true
  });

  
  game.settings.register(MODULE.moduleName,'enable', {
    scope: "world",
    config: false,
    default: false,
    type: Boolean,
  });

  let menu = new helpMenu;
  menu.render(true);
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

