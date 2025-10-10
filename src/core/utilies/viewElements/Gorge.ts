import * as PIXI from "pixi.js";

import { IPosition } from "../interfaces/common/IPosition";
import { IGorgeElementConfig } from "../interfaces/elementConfigs.ts/IGorgeElementConfig";
import { BaseGameElement } from "./BaseGameElement";
import { GameComponent } from "./GameComponent";
import { Application } from "../../../Application";

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
        // this.on(
        //     'mouseover', () => {
        //         this.getAllCurrentGameComponents().forEach( (component, index) => {
        //             component.x += 5;
        //             component.y += 5;
        //         })        
        //     }
        // );

        // this.on(
        //     'mouseout', () => {
        //         this.getAllCurrentGameComponents().forEach( (component, index) => {
        //             component.x -= 5;
        //             component.y -= 5;
        //         })        
        //     }
        // )
    }

    public onResize() {
        this.getAllCurrentGameComponents().forEach( (component, index) => {
            const { x, y } = this.getElementGameComponentPosition(index);

            component.x = x;
            component.y = y;
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
            const x = Math.random() * this.width * 0.80 + this.width * 0.05;
            const y = Math.random() * this.height * 0.80 + this.height * 0.05;
            const position: PIXI.Point = new PIXI.Point(this.position.x  + x, this.position.y + y)

            return position;
    }

    private createGorgeView() {
        if (!this.elementConfig.assetName) {
            this.craateTransperentGorge();
            return;
        }

        const sprite = new PIXI.Sprite(Application.APP.assetManager.gameplayAssets[this.elementConfig.assetName])
        this.addChild(sprite);
    }

    private craateTransperentGorge() {
        const gfx = new PIXI.Graphics();

        gfx.rect(0, 0, this.elementConfig.size.w, this.elementConfig.size.h)
        gfx.fill({
            color: 0xffffff, 
            alpha: 0.5
            // alpha: Number.MIN_VALUE
        })

        this.addChild(gfx);
    }
}