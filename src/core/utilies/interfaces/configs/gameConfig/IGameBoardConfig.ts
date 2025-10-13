import { IElementSize } from "../../common/IElementSize";
import { IPosition } from "../../common/IPosition";

export interface IGameBoardConfig {
    assetName: string;
    size: IElementSize;
    globalPositions: IPosition;
    anchor?: IPosition;
}