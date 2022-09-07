import { moduleName } from "../sharedvision.js";
import { compatibleCore, getOverride } from "./misc.js";

export let tokenStorage = [];

export class displayedTokenLayer extends CanvasLayer {
    constructor(token) {
        super();
        this.zIndex = 2000;
        this.init(token);
    }

    async draw() {
        super.draw();
    }

    init(token) {
        this.container = new PIXI.Container();
        this.addChild(this.container);
        let tokenIcon = PIXI.Sprite.from(compatibleCore('10.0') ? token.document.texture.src : token.data.img);
        const gridSize = canvas.grid.size;
        const tokenWidth = compatibleCore('10.0') ? token.document.width : token.data.width;
        const tokenHeight = compatibleCore('10.0') ? token.document.height : token.data.height;
        const tokenScale = compatibleCore('10.0') ? token.document.texture.scaleX : token.data.scale;
        const hidden = compatibleCore('10.0') ? token.document.hidden : token.data.hidden;
        const rotation = compatibleCore('10.0') ? token.document.rotation : 0;
        
        const size = tokenWidth;
        if (tokenHeight > size) size = tokenHeight;
        tokenIcon.width = size*tokenScale*gridSize;
        tokenIcon.height = size*tokenScale*gridSize;
        if (hidden) tokenIcon.alpha = 0.5;
        tokenIcon.angle = rotation;
        tokenIcon.anchor.set(0.5);
        this.container.addChild(tokenIcon);

        let x = compatibleCore('10.0') ? token.document.x : token.data.x;
        let y = compatibleCore('10.0') ? token.document.y : token.data.y;
        x += tokenWidth*gridSize/2;
        y += tokenHeight*gridSize/2;

        this.container.setTransform(x, y);
        this.container.visible = true;
        canvas.stage.addChild(this);
    }

    updatePosition(token) {
        const tokenWidth = compatibleCore('10.0') ? token.document.width : token.data.width;
        const tokenHeight = compatibleCore('10.0') ? token.document.height : token.data.height;
        const gridSize = canvas.grid.size;
        let x = compatibleCore('10.0') ? token.document.x : token.data.x;
        let y = compatibleCore('10.0') ? token.document.y : token.data.y;
        x += tokenWidth*gridSize/2;
        y += tokenHeight*gridSize/2;

        this.container.setTransform(x, y);
    }

    remove() {
        canvas.stage.removeChild(this);
    }
}

export function drawNewToken(token) {
    tokenStorage.push({
        tokenId: compatibleCore('10.0') ? token.document._id : token.id,
        icon: new displayedTokenLayer(token)
    })
}

export function moveToken(token) {
    if (token == undefined) return;
    const actor = game.actors.get(compatibleCore('10.0') ? token.actor.id : token.data.actorId);
    const userSetting = actor.getFlag('SharedVision','userSetting')?.find(u => u.id == game.userId);
    const shareHidden = actor.getFlag('SharedVision','hidden');
    const tokenId = compatibleCore('10.0') ? token.document._id : token.id;
    if (userSetting?.vision || getOverride('vision',token) || (userSetting?.token != true && !getOverride('token',token))) return;

    const storage = tokenStorage.find(s => s.tokenId == tokenId)
    
    if (game.settings.get(moduleName,'disableAll') || token.visible || ((compatibleCore('10.0') ? token.document.hidden : token.data.hidden) && !shareHidden)) {
        if (storage != undefined) {
            storage.icon.remove();
            tokenStorage.splice(tokenStorage.findIndex(s => s.tokenId == tokenId),1) 
        }
        return;
    }
    
    if (storage == undefined) drawNewToken(token);
    else storage.icon.updatePosition(token);
}

export function updateToken(token) {
    if (token == undefined) return;
    const actor = game.actors.get(compatibleCore('10.0') ? token.actor.id : token.data.actorId);
    const userSetting = actor.getFlag('SharedVision','userSetting')?.find(u => u.id == game.userId);
    const shareHidden = actor.getFlag('SharedVision','hidden');
    const tokenId = compatibleCore('10.0') ? token.document._id : token.id;
    
    const storage = tokenStorage.find(s => s.tokenId == tokenId)
    if (userSetting?.vision || getOverride('vision',token) || (!getOverride('token',token) && userSetting?.token != true) || game.settings.get(moduleName,'disableAll') || token.visible || ((compatibleCore('10.0') ? token.document.hidden : token.data.hidden) && !shareHidden)) {
        if (storage != undefined) {
            storage.icon.remove();
            tokenStorage.splice(tokenStorage.findIndex(s => s.tokenId == tokenId),1) 
        }
        return;
    }
    if (storage == undefined) drawNewToken(token);
    else {
        storage.icon.remove();
        const tokenId = compatibleCore('10.0') ? token.document._id : token.id;
        tokenStorage.splice(tokenStorage.findIndex(s => s.tokenId == tokenId),1) 
        drawNewToken(token);
    }
}

export function updateAllTokens() {
    const tokens = canvas.tokens.placeables;
    for (let token of tokens) {
        updateToken(token);
    }
}