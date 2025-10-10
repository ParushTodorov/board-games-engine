import { IElementSize } from "../common/IElementSize"
import { IPosition } from "../common/IPosition"

export interface IGorgeConfig {
    assetName?: string;
    size: IElementSize;
    count: number;
    globalPositions: {
        [key: number]: IPosition;
    },
    gameComponentsPosition?: {
        [key: number]: IPosition;
    }
}