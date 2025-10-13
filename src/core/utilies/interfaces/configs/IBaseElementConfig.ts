import { IDimension } from "../common/IDimension";
import { IElementSize } from "../common/IElementSize";
import { IPosition } from "../common/IPosition";

export interface IBaseElementConfig {
    assetName: string;
    size?: IElementSize;
    globalPositions: IPosition;
    anchor?: IPosition;
    componentsPosition?: {
        [key: number]: IPosition;
    }
}