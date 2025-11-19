import * as PIXI from "pixi.js";

import { GameComponent } from "../../../core/utilies/viewElements/GameComponent";
import { IElementConfig } from "../../../core/utilies/interfaces/elementConfigs/IElementConfig";

export class CustomGameComponent extends GameComponent {
    private crown: PIXI.Sprite;

    constructor(gameComponentConfig: IElementConfig) {
        super(gameComponentConfig);

        this.crown = PIXI.Sprite.from(this.app.assetManager.gameplayAssets["crown"]);
        this.crown.anchor.set(0.5);
        
        const scale = this.width * 0.7 / this.crown.width;
        this.crown.scale.set(scale);

        this.crown.x = this.width / 2;
        this.crown.y = this.height / 2;

        this.crown.visible = false;
        this.addChild(this.crown);
    }

    public activateCrown() {
        this.crown.visible = true;
    }

    public deactivateCrown() {
        this.crown.visible = false;
    }

    public isKing() {
        return this.crown.visible;
    }
}