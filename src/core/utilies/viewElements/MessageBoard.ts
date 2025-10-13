import * as PIXI from "pixi.js";

import { BaseMainViewElement } from "./BaseMainViewElement";
import { IElementSize } from "../interfaces/common/IElementSize";

export class MessageBoard extends BaseMainViewElement {
    public BASE_SIZE: IElementSize = {
        w: 600,
        h: 50
    }

    private demo_message = "START GAME";

    protected text: PIXI.Text;

    constructor() {
        super();

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

    public setText(message: string) {
        this.text.text = message;

        this.resize();
    }

    public onResize(maxSize: IElementSize) {
        this.BASE_SIZE.w = maxSize.w;
        this.BASE_SIZE.h = maxSize.h;

        this.resize();
    }

    private resize() {
        const scale = Math.min(this.BASE_SIZE.w * 0.9 / (this.text.width / this.text.scale.x), this.BASE_SIZE.h * 0.9 / (this.text.height, this.text.scale.y), 1);

        this.text.scale.set(scale);
    }
}