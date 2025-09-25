import { IElementConfig } from "../interfaces/elementConfigs.ts/IElementConfig";
import { BaseMainViewElements } from "./BaseMainViewElement";

export class BaseGameElement extends BaseMainViewElements {

    protected gorgeConfig: IElementConfig;

    constructor(gorgeConfig: IElementConfig) {
        super();

        this.gorgeConfig = gorgeConfig;
    }

    public getName(): string {
        return `${this.gorgeConfig.type}-${this.gorgeConfig.id}`;
    }

    public getType(): string {
        return this.gorgeConfig.type;
    }

    public getId(): number {
        return this.gorgeConfig.id;
    }
}