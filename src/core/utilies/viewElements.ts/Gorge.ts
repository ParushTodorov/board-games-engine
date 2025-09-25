import * as PIXI from "pixi.js";

import { IPosition } from "../interfaces/common/IPosition";
import { IGorgeElementConfig } from "../interfaces/elementConfigs.ts/IGorgeElementConfig";
import { BaseGameElement } from "./BaseGameElement";
import { GameComponent } from "./GameComponent";

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
        this.on(
            'pointerdown', () => {
                
            }
        )
    }

    public addNewGameComponent(gameComponent: GameComponent) {
        gameComponent.setGorgeOwner(this.getName());
        this.currentGameComponents.set(gameComponent.name, gameComponent);
    }

    public removeGameComponent(gameComponentName: string) {
        if (!this.currentGameComponents.has(gameComponentName)) return;

        const gameComponent = this.currentGameComponents.get(gameComponentName);
        gameComponent&& gameComponent.setGorgeOwner("");
        this.currentGameComponents.delete(gameComponentName);
    }

    public removeAllGameComponents() {
        this.getAllCurrentGameComponents().forEach(
            el => el.setGorgeOwner("")
        )
        this.currentGameComponents.clear();
    }

    public getAllCurrentGameComponentsNames(): Array<string> {
        return Array.from(this.currentGameComponents.keys());
    }

    public getAllCurrentGameComponents(): Array<GameComponent> {
        return Array.from(this.currentGameComponents.values());
    }

    public getNextElementPosition(): PIXI.Point {
        if (this.gameComponentsPosition) {
            const nextElementId: number = this.getAllCurrentGameComponentsNames().length + 1;

            const position: PIXI.Point = this.toGlobal(this.gameComponentsPosition[nextElementId])

            return position;
        }

        return this.toGlobal(this);
    }

    private createGorgeView() {

    }
}