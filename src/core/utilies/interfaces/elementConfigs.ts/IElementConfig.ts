import { GameElementType } from "../../types/GameElementTypes";
import { IElementSize } from "../common/IElementSize"

export interface IElementConfig {
    type: GameElementType;
    name: string;
    assetName?: string;
    size: IElementSize;
    id: number;
}