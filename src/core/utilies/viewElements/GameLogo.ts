import * as PIXI from "pixi.js";

import { BaseMainViewElement } from "./BaseMainViewElement";
import { IBaseElementConfig } from "../interfaces/configs/IBaseElementConfig";

export class GameLogo extends BaseMainViewElement {
    protected gameLogoConfig: IBaseElementConfig;
    protected sprite: PIXI.Sprite;

    constructor(gameLogoConfig: IBaseElementConfig) {
        super();

        this.gameLogoConfig = gameLogoConfig;

        this.sprite = new PIXI.Sprite(this.app.assetManager.gameplayAssets[this.gameLogoConfig.assetName]);
        const scale = Math.min(gameLogoConfig.size.w / this.sprite.width, gameLogoConfig.size.h / this.sprite.height);

        this.sprite.scale.set(scale);

        this.addChild(this.sprite);
    }
}