import * as PIXI from "pixi.js";

import { IBackgroundConfig } from "../interfaces/configs/gameConfig/IBackgroundConfig";
import { BaseMainViewElement } from "./BaseMainViewElement";
import { Application } from "../../../Application";

export class Background extends BaseMainViewElement {
    private backgroundConfig: IBackgroundConfig;

    constructor(backgroundConfig: IBackgroundConfig) {
        super();

        this.backgroundConfig = backgroundConfig;

        this.createBackground();
    }

    private createBackground() {
        const sprite = new PIXI.Sprite(Application.APP.assetManager.gameplayAssets[this.backgroundConfig.assetName]);
        this.addChild(sprite);
    }
}