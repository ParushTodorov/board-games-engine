import * as PIXI from "pixi.js";

import { IPosition } from "../interfaces/common/IPosition";
import { IGorgeElementConfig } from "../interfaces/elementConfigs/IGorgeElementConfig";
import { BaseGameElement } from "./BaseGameElement";
import { GameComponent } from "./GameComponent";
import { Application } from "../../../Application";
import { GameEvents } from "../GameEvents";

export class Gorge extends BaseGameElement {

    private gameComponentsPosition?: {[key: number]: IPosition;}
    private currentGameComponents: Map<string, GameComponent> = new Map();

    constructor(gorgeConfig: IGorgeElementConfig) {
        super(gorgeConfig);

        if (gorgeConfig.gameComponentsPosition) {
            this.gameComponentsPosition = gorgeConfig.gameComponentsPosition;
        }

        this.createGorgeView();

        this.interactive = true;

        this.on('pointerup', (e) => {
            this.app.emitter.emit(GameEvents.GORGE_UP, e ,this.getName());
        })

        this.on('pointerenter', (e) => {
            this.app.emitter.emit(GameEvents.GORGE_OVER, e ,this.getName());
        })

        this.on('pointerleave', (e) => {
            this.app.emitter.emit(GameEvents.GORGE_OUT, e ,this.getName());
        })
    }

    public addNewGameComponent(gameComponent: GameComponent) {
        gameComponent.setGorgeOwner(this.getName());
        this.currentGameComponents.set(gameComponent.getName(), gameComponent);
    }

    public removeGameComponent(gameComponentName: string) {
        if (!this.currentGameComponents.has(gameComponentName)) return;

        const gameComponent = this.currentGameComponents.get(gameComponentName);
        gameComponent&& gameComponent.setGorgeOwner("");
        this.currentGameComponents.delete(gameComponentName);
    }

    public removeAllGameComponents() {
        const allGameComponents = this.getAllCurrentGameComponents()
        allGameComponents.forEach(
            el => el.setGorgeOwner("")
        )
        this.currentGameComponents.clear();

        return allGameComponents;
    }

    public getAllCurrentGameComponentsNames(): Array<string> {
        return Array.from(this.currentGameComponents.keys());
    }

    public getAllCurrentGameComponents(): Array<GameComponent> {
        return Array.from(this.currentGameComponents.values());
    }

    public getElementsCount(): number {
        return this.currentGameComponents.size;
    }

    public getNextElementPosition(): PIXI.Point {
        if (this.gameComponentsPosition) {
            const nextElementId: number = this.getAllCurrentGameComponentsNames().length;

            return this.getElementGameComponentPosition(nextElementId);
        }

        return this.getElementRandomPosition();
    }

    private getElementGameComponentPosition(id: number) {
            const x = (this.gameComponentsPosition[id].x + 0.75) * this.width / 2;
            const y = (this.gameComponentsPosition[id].y + 0.75)  * this.height / 2;
            const position: PIXI.Point = new PIXI.Point(this.position.x + x, this.position.y + y)

            return position;
    }

    private getElementRandomPosition() {
            const x = Math.random() * this.width * 0.65 + this.width * 0.05;
            const y = Math.random() * this.height * 0.75 + this.height * 0.05;
            const position: PIXI.Point = new PIXI.Point(this.position.x + x, this.position.y + y);

            return position;
    }

    private createGorgeView() {
        if (!this.elementConfig.assetName) {
            this.craateTransperentGorge();
            return;
        }

        const sprite = new PIXI.Sprite(this.app.assetManager.gameplayAssets[this.elementConfig.assetName])
        this.addChild(sprite);
    }

    private craateTransperentGorge() {
        const gfx = new PIXI.Graphics();

        gfx.rect(-this.elementConfig.size.w / 2, -this.elementConfig.size.h / 2, this.elementConfig.size.w, this.elementConfig.size.h)
        gfx.fill({
            color: 0xffffff, 
            alpha: Number.MIN_VALUE
        });

        this.addChild(gfx);
    }
}