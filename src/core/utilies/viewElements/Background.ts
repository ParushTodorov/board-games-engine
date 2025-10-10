import * as PIXI from "pixi.js";

import { IBackgroundConfig } from "../interfaces/configs/IBackgroundConfig";
import { BaseMainViewElements } from "./BaseMainViewElement";
import { Application } from "../../../Application";

export class Background extends BaseMainViewElements {
    private backgroundConfig: IBackgroundConfig;

    constructor(backgroundConfig: IBackgroundConfig) {
        super();

        this.backgroundConfig = backgroundConfig;

        this.createBackground();
    }

    private createBackground() {
        const sprite = new PIXI.Sprite(Application.APP.assetManager.gameplayAssets[this.backgroundConfig.assetName]);
        console.log(sprite.width, sprite.height);
        // this.backgroundConfig.anchor && sprite.anchor.set(this.backgroundConfig.anchor.x, this.backgroundConfig.anchor.y);
        this.addChild(sprite);
    }
}