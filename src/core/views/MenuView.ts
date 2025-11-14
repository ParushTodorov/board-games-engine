import * as PIXI from "pixi.js";
import { BaseView } from "./BaseView";

export class MenuView extends BaseView {

    private text: PIXI.Text;

    public init() {
        const { width, height, isLandscape} = this.app.viewSizes;
        
        const sizeCoef = isLandscape() ? 0.15 : 0.075;
        
        const text = new PIXI.Text();

        text.style.fill = 0xffffff;
        text.style.fontSize = sizeCoef * height;
        text.anchor = 0.5;

        text.text = "MENU";

        text.x = width * 0.5;
        text.y = height * 0.2;

        this.addChild(text);

        this.text = text;
    }

    public onResize(): void {
        const { width, height, isLandscape} = this.app.viewSizes;
        
        const sizeCoef = isLandscape() ? 0.15 : 0.075;
        this.text.style.fontSize = sizeCoef * height;

        this.text.x = width * 0.5;
        this.text.y = height * 0.2;
    }
}