import * as PIXI from "pixi.js";
import { Application } from "../../Application";
import { IBaseElementConfig } from "../utilies/interfaces/configs/IBaseElementConfig";
import { BaseMainViewElement } from "../utilies/viewElements/BaseMainViewElement";
import { MessageBoard } from "../utilies/viewElements/MessageBoard";
import { MessageManager } from "../managers/MessageManager";

export class StatusBarView extends BaseMainViewElement {

    private statusBarConfig: IBaseElementConfig;
    private messageBoard: MessageBoard;
    private messageManager: MessageManager;
    private statusBarSprite: PIXI.Sprite;

    constructor(statusBarConfig: IBaseElementConfig) {
        super();

        this.statusBarConfig = statusBarConfig;

        this.statusBarSprite = new PIXI.Sprite(Application.APP.assetManager.commonAssets[this.statusBarConfig.assetName]);
        this.addChild(this.statusBarSprite);

        this.statusBarSprite.tint = 0xD2AA6D;
        this.statusBarSprite.anchor.set(0, 1);

        this.messageBoard = new MessageBoard();
        this.addChild(this.messageBoard);

        this.messageManager = new MessageManager();
        this.messageManager.init(this.messageBoard);

        this.onResize();
    }

    public onResize() {
        const { width, height } = this.app.viewSizes;
        const scale = Math.min(width / (this.statusBarSprite.width / this.statusBarSprite.scale.x), height / (this.statusBarSprite.height / this.statusBarSprite.scale.y));
        this.statusBarSprite.scale.set(scale);

        const orientationHeight = this.app.viewSizes.isLandscape() ? height * 0.15 : height * 0.08
        this.statusBarSprite.height = orientationHeight;

        this.messageBoard.x = width / 2;
        this.messageBoard.y = - this.statusBarSprite.height / 2;

        this.messageBoard.onResize({w: width * 0.6, h: orientationHeight});
    }
}