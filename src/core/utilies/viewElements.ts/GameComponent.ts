import gsap from "gsap";
import { IPosition } from "../interfaces/common/IPosition";
import { IElementConfig } from "../interfaces/elementConfigs.ts/IElementConfig";
import { IMoveable } from "../interfaces/elementConfigs.ts/IMoveable";
import { BaseGameElement } from "./BaseGameElement";

export class GameComponent extends BaseGameElement implements IMoveable{

    private _gorgeOwner: string = "";

    constructor(gameComponentConfig: IElementConfig) {
        super(gameComponentConfig);

        this.createGameCopmonentView();

        this.interactive = true;
        this.on(
            'pointerdown', () => {
                
            }
        )
    }

    public move(endPosition: IPosition) {
        gsap.to(
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

    }
}