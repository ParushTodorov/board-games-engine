import * as PIXI from "pixi.js";

import { BaseMainViewElement } from "./BaseMainViewElement";
import { IElementSize } from "../interfaces/common/IElementSize";
import { IBaseElementConfig } from "../interfaces/configs/IBaseElementConfig";
import { Application } from "../../../Application";
import { GameEvents } from "../GameEvents";

export class MessageBoard extends BaseMainViewElement {
    private statusBarConfig: IBaseElementConfig;
    private statusBarSprite!: PIXI.Sprite;
    private statusBarLine!: PIXI.Sprite;
    private menuButton!: PIXI.Sprite;

    public BASE_SIZE: IElementSize = {
        w: 600,
        h: 50
    }

    private demo_message = "START GAME";

    protected text!: PIXI.Text;

    constructor(config: IBaseElementConfig) {
        super();

        this.statusBarConfig = config;

        this.createBackground();
        this.createText();
        this.createStatusBarLine();
        this.createMenuButton();
        this.onResize();
    }

    public setText(message: string) {
        this.text.text = message;

        this.resize();
    }

    public getText(): string {
        return this.text.text;
    }

    public onResize() {
        const { width, height } = this.app.viewSizes;

        const scale = width / (this.statusBarSprite.width / this.statusBarSprite.scale.x);
        this.statusBarSprite.scale.set(scale);

        const orientationHeight = this.app.viewSizes.isLandscape() ? height * 0.1 : height * 0.08;
        this.statusBarSprite.height = orientationHeight;

        if (this.statusBarLine) {
            const orientationHeightCoef = this.app.viewSizes.isLandscape() ? height * 0.1 : height * 0.08;
            this.statusBarLine.width = this.statusBarSprite.width;
            this.statusBarLine.height = this.statusBarSprite.height * 0.25;
            this.statusBarLine.x = 0;
            this.statusBarLine.y = -(this.statusBarSprite.height + this.statusBarLine.height);
        } 
        
        if (this.menuButton) {
            const offsetCoef = this.app.viewSizes.isLandscape() ? 1.5 : 1.1;
            const sizeCoef =  this.app.viewSizes.isLandscape() ? 0.8 : 0.6;

            this.menuButton.width = orientationHeight * sizeCoef;
            this.menuButton.height = orientationHeight * sizeCoef;
            
            this.menuButton.x = this.statusBarSprite.width - this.menuButton.width * offsetCoef;
            this.menuButton.y = - this.statusBarSprite.height * (sizeCoef + (1 - sizeCoef) / 2);
        }

        this.text.x = this.statusBarSprite.width / 2;
        this.text.y = - this.statusBarSprite.height / 2;

        this.BASE_SIZE = {w: width * 0.6, h: orientationHeight};

        this.resize();
    }

    protected createBackground() {
        this.statusBarSprite = new PIXI.Sprite(Application.APP.assetManager.commonAssets[this.statusBarConfig.assetName]);
        this.addChild(this.statusBarSprite);
        
        this.statusBarSprite.alpha = 0.80;
        this.statusBarSprite.anchor.set(0, 1);
    }
    
    protected createStatusBarLine() {
        if (!Application.APP.assetManager.gameplayAssets['statusBarLine']) return;

        this.statusBarLine = new PIXI.Sprite(Application.APP.assetManager.gameplayAssets['statusBarLine']);
        console.log(this.statusBarLine.width, this.statusBarLine.height);
        this.addChild(this.statusBarLine);
    }

    protected createMenuButton() {
        if (!Application.APP.assetManager.commonAssets['menuButton']) return;

        this.menuButton = new PIXI.Sprite(Application.APP.assetManager.commonAssets['menuButton']);
        this.menuButton.label = 'menuButton';
        this.menuButton.interactive = true;
        this.addChild(this.menuButton);

        let isPressed: boolean = false;

        this.menuButton.on('pointerdown', () => {
            this.menuButton.x += this.menuButton.width * 0.025;
            this.menuButton.y += this.menuButton.width * 0.025;

            isPressed = true;
        })

        this.menuButton.on('pointerup', () => {
            this.app.emitter.emit(GameEvents.MENU_BUTTON_PRESS);
        })

        document.addEventListener('pointerup', () => {
            if (isPressed) {
                this.menuButton.x -= this.menuButton.width * 0.025;
                this.menuButton.y -= this.menuButton.width * 0.025;

                isPressed = false;
            }
        })
    }

    private createText() {
        this.text = new PIXI.Text();
        this.text.style.fill = 0xffffff;
        this.text.style.fontFamily = "Impact";
        this.text.style.fontSize = 35;
        this.text.anchor.set(0.5);
        this.text.style.dropShadow = {
            alpha: 1,
            angle: 40,
            blur: 1,
            color: 0x000000,
            distance: 1
        };

        this.text.text = this.demo_message;
        this.resize();

        this.addChild(this.text);
    }

    private resize() {
        const scale = Math.min(this.BASE_SIZE.w * 0.9 / (this.text.width / this.text.scale.x), this.BASE_SIZE.h * 0.9 / (this.text.height, this.text.scale.y), 1);

        this.text.scale.set(scale);
    }
}