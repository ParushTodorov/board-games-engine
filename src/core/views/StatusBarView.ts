import * as PIXI from "pixi.js";
import { Application } from "../../Application";
import { IBaseElementConfig } from "../utilies/interfaces/configs/IBaseElementConfig";
import { BaseMainViewElement } from "../utilies/viewElements/BaseMainViewElement";

export class StatusBarView extends BaseMainViewElement {

    private statusBarConfig: IBaseElementConfig;

    private statusBarSprite: PIXI.Sprite;

    constructor(statusBarConfig: IBaseElementConfig) {
        super();

        this.statusBarConfig = statusBarConfig;

        this.statusBarSprite = new PIXI.Sprite(Application.APP.assetManager.commonAssets[this.statusBarConfig.assetName]);
        this.addChild(this.statusBarSprite);

        this.statusBarSprite.tint = 0xD2AA6D;
        this.statusBarSprite.anchor.set(0, 1);

        this.onResize();
    }

    public onResize() {
        const { width, height } = Application.APP.viewSizes;
        const scale = Math.min(width / (this.statusBarSprite.width / this.statusBarSprite.scale.x), height / (this.statusBarSprite.height / this.statusBarSprite.scale.y));
        this.statusBarSprite.scale.set(scale);

        this.statusBarSprite.height = height * 0.15;
    }
}