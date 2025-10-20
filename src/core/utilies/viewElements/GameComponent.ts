import * as PIXI from "pixi.js";
import gsap from "gsap";
import { IPosition } from "../interfaces/common/IPosition";
import { IElementConfig } from "../interfaces/elementConfigs/IElementConfig";
import { IMoveable } from "../interfaces/elementConfigs/IMoveable";
import { BaseGameElement } from "./BaseGameElement";
import { Application } from "../../../Application";
import { GameEvents } from "../GameEvents";
import { Gorge } from "./Gorge";

export class GameComponent extends BaseGameElement implements IMoveable{
    
    private _gorgeOwner: Gorge;

    private _isDragging: boolean = false;

    constructor(gameComponentConfig: IElementConfig) {
        super(gameComponentConfig);

        this.createGameCopmonentView();

        this.interactive = true;
        this.on(
            'pointerdown', (e) => {
                e.stopPropagation();
                this.app.emitter.emit(GameEvents.GAME_COMPONENT_DOWN, e, this.getGorgeOwner().getName(), this.getName())
            }
        );
        this.on(
            'pointerup', (e) => {
                e.stopPropagation();
                this.app.emitter.emit(GameEvents.GAME_COMPONENT_UP, e, this.getGorgeOwner().getName(), this.getName())
            }
        )
    }

    public async move(endPosition: IPosition, onComplete: () => void = ()=> {}) {
        await gsap.to(
            this,
            {
                x: endPosition.x,
                y: endPosition.y,
                duration: 0.15,
                onComplete
            },
        );
    }

    public async moveFromGlobalPosition(position: PIXI.Point) {
        const endPosition = this.parent.toLocal(position);
        endPosition.x -= this.width / 2;
        endPosition.y -= this.height / 2;

        await this.move(endPosition);
    }

    public setGorgeOwner(value: Gorge | undefined) {
        this._gorgeOwner = value;
    }

    public getGorgeOwner(): Gorge | undefined {
        return this._gorgeOwner;
    }

    public startDragging(): void {
        this._isDragging = true;
    }

    public stopDragging(): void {
        this._isDragging = false;
    }

    public isDragging(): boolean {
        return this._isDragging;
    }

    private createGameCopmonentView() {
        const sprite = new PIXI.Sprite(this.app.assetManager.gameplayAssets[this.elementConfig.assetName]);

        const scale = Math.min(this.elementConfig.size.w / sprite.width, this.elementConfig.size.h / sprite.height);
        sprite.scale.set(scale);

        this.addChild(sprite);
    }
}