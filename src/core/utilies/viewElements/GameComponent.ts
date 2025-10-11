import * as PIXI from "pixi.js";
import gsap from "gsap";
import { IPosition } from "../interfaces/common/IPosition";
import { IElementConfig } from "../interfaces/elementConfigs.ts/IElementConfig";
import { IMoveable } from "../interfaces/elementConfigs.ts/IMoveable";
import { BaseGameElement } from "./BaseGameElement";
import { Application } from "../../../Application";
import { GameEvents } from "../../GameEvents";

export class GameComponent extends BaseGameElement implements IMoveable{
    
    private _gorgeOwner: string = "";

    constructor(gameComponentConfig: IElementConfig) {
        super(gameComponentConfig);

        this.createGameCopmonentView();

        this.interactive = true;
        this.on(
            'pointerdown', () => {
                Application.APP.emitter.emit(GameEvents.TOUCH_TO_MOVE, {startElement: this.getGorgeOwner(), element: this.getName()})
            }
        )
    }

    public async move(endPosition: IPosition) {
        await gsap.to(
            this,
            {
                x: endPosition.x,
                y: endPosition.y,
                duration: 0.15
            },
        )
    }

    public setGorgeOwner(value: string) {
        this._gorgeOwner = value;
    }

    public getGorgeOwner(): string {
        return this._gorgeOwner;
    }

    private createGameCopmonentView() {
        const sprite = new PIXI.Sprite(Application.APP.assetManager.gameplayAssets[this.elementConfig.assetName]);

        const scale = Math.min(this.elementConfig.size.w / sprite.width, this.elementConfig.size.h / sprite.height);
        sprite.scale.set(scale);

        this.addChild(sprite);
    }
}