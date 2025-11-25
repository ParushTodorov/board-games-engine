import * as PIXI from "pixi.js";

import { IBackgroundConfig } from "../interfaces/configs/gameConfig/IBackgroundConfig";
import { BaseMainViewElement } from "./BaseMainViewElement";
import { Application } from "../../../Application";
import { IPosition } from "../interfaces/common/IPosition";

export class Background extends BaseMainViewElement {
    public set anchor(value: IPosition) {
        this.backgroundSprite.anchor.set(value.x, value.y);
    }
    
    private backgroundConfig: IBackgroundConfig;
    private backgroundSprite!: PIXI.Sprite;

    constructor(backgroundConfig: IBackgroundConfig) {
        super();

        this.backgroundConfig = backgroundConfig;

        this.createBackground();
    }

    private createBackground() {
        this.backgroundSprite = new PIXI.Sprite(this.app.assetManager.gameplayAssets[this.backgroundConfig.assetName]);
        this.addChild(this.backgroundSprite);
    }
}