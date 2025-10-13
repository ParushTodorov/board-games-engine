import { IPosition } from "../common/IPosition";

export interface IMoveable {
    move(endPosition: IPosition): void;
}