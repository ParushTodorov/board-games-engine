import { IElementSize } from "../common/IElementSize"
import { IPosition } from "../common/IPosition"
import { IElementConfig } from "./IElementConfig";

export interface IGorgeElementConfig extends IElementConfig {
    gameComponentsPosition?: {
        [key: number]: IPosition;
    }
}