import { IElementSize } from "../common/IElementSize";
import { IPosition } from "../common/IPosition";

export interface IGameBoardConfig {
    assetName: string;
    size: IElementSize;
    position: IPosition;
    anchor?: IPosition;
}