import * as PIXI from "pixi.js";
import { BaseView } from "./BaseView";
import { IPosition } from "../utilies/interfaces/common/IPosition";
import { getGlobalThis } from "@microsoft/signalr/dist/esm/Utils";
import gsap from "gsap";
import { IElementSize } from "../utilies/interfaces/common/IElementSize";
import { IDimension } from "../utilies/interfaces/common/IDimension";

export class LoadingView extends BaseView {
    protected background: PIXI.Graphics;
    protected logoContainer: PIXI.Container;
    protected startPositions: {[key: number]: {[key: string]: number}} = {
        0: {x: 0, y: 0},
        1: {x: -2000, y: 0},
        2: {x: 2000, y: 0},
        3: {y: 2000, x: 0},
        4: {y: -2000, x: 0},
        5: {y: 2000, x: 0}
    }

    protected baseLogoSize: IDimension;

    constructor() {
        super();

        this.createBackground();
        this.createCompanyLogo();
        this.onResize();
    }

    public async playStartAnimation() {
        for (let i=0; i <this.logoContainer.children.length; i++){
            const sprite = this.logoContainer.children[i]
            const startPosition = this.startPositions[i];
            const {x, y} = sprite;

            sprite.x += startPosition["x"];
            sprite.y += startPosition["y"];

            await gsap.to(sprite, {
                x,
                y,
                alpha: 1,
                duration: 0.35
            })
        }
    }

    public onResize(): void {
        const { width, height } = this.app.viewSizes;

        this.background.width = width;
        this.background.height = height;

        const scale = Math.min((width * 0.75) / this.baseLogoSize.width, (height * 0.75) / this.baseLogoSize.height);

        this.logoContainer.scale.set(scale);

        this.logoContainer.x = (width - this.logoContainer.width) / 2 + this.baseLogoSize.x * scale;
        this.logoContainer.y = (height - this.logoContainer.height) / 2 + this.baseLogoSize.y * scale;
    }

    protected createBackground() {
        const { width, height } = this.app.viewSizes;
        const gfx = new PIXI.Graphics();
        gfx.rect(0, 0, width, height);
        gfx.fill({
            color: 0x800000
        })
        this.background = gfx;
        this.addChild(this.background);
    }

    protected async createCompanyLogo() {
        const config = this.app.commonConfig.elements["loadingView"];
        const textures = this.app.assetManager.loadingAssets[this.app.commonConfig.elements["loadingView"].assetName].textures;
        const componentsPosition: {[key: string]: IPosition} = config.componentsPosition;

        this.logoContainer = new PIXI.Container();

        Object.keys(componentsPosition).forEach(
            async (l) => {
                const sprite = new PIXI.Sprite(textures[l]);
                sprite.x = componentsPosition[l].x;
                sprite.y = componentsPosition[l].y;
                sprite.alpha = 0;
                this.logoContainer.addChild(sprite);
            }
        )

        const radius = config.size.h * 0.75;
        const gfx = new PIXI.Graphics();
        gfx.circle(0, 0, radius)
        gfx.stroke({
            width: 20,
            color: 0x000000
        })
        gfx.fill({
            color: 0xffffff
        })

        gfx.alpha = 0;
        
        this.baseLogoSize = { 
            x: radius - this.logoContainer.width / 2,
            y: radius - this.logoContainer.height / 2,
            width: radius * 2,
            height: radius * 2
        }

        gfx.x = this.logoContainer.width / 2;
        gfx.y = this.logoContainer.height / 2;

        gfx.filters = [new PIXI.BlurFilter({
            strength: 1
        })];

        this.logoContainer.addChildAt(gfx, 0);

        // this.logoContainer.

        this.addChild(this.logoContainer);
    }
}