import { IElementConfig } from "../interfaces/elementConfigs.ts/IElementConfig";
import { GameElementType } from "../types/GameElementTypes";
import { BaseMainViewElements } from "./BaseMainViewElement";

export class BaseGameElement extends BaseMainViewElements {

    protected elementConfig: IElementConfig;

    constructor(elementConfig: IElementConfig) {
        super();

        this.elementConfig = elementConfig;
    }

    public getName(): string {
        return `${this.elementConfig.name}-${this.elementConfig.id}`;
    }

    public getType(): GameElementType {
        return this.elementConfig.type;
    }

    public getId(): number {
        return this.elementConfig.id;
    }
}