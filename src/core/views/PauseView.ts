import * as PIXI from "pixi.js";
import { BaseView } from "./BaseView";
import { IPosition } from "../utilies/interfaces/common/IPosition";
import { getGlobalThis } from "@microsoft/signalr/dist/esm/Utils";
import gsap from "gsap";
import { IElementSize } from "../utilies/interfaces/common/IElementSize";
import { IDimension } from "../utilies/interfaces/common/IDimension";

export class PauseView extends BaseView {

    protected background: PIXI.Graphics;

    public init() {
        const background = new PIXI.Graphics();
        background.rect(0, 0, this.app.viewSizes.width, this.app.viewSizes.height);
        background.fill({color: 0x000000, alpha: 0.9})

        this.addChild(background);

        this.background = background;
    }

    public onResize(): void {
        const { width, height} = this.app.viewSizes;

        this.background.width = width;
        this.background.height = height;
    }
}