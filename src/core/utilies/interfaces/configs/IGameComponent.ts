import { IElementSize } from "../common/IElementSize";
import { IPosition } from "../common/IPosition";

export interface IGameComponent {
    assetName: string;
    size: IElementSize;
    count: number;
    globalPositions?: {
        [key: number]: IPosition;
    }
}

