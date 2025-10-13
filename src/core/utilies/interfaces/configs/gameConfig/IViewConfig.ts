import { IBaseElementConfig } from "../IBaseElementConfig";
import { IDimension } from "../../common/IDimension";
import { IPosition } from "../../common/IPosition";

export interface IViewConfig {
    elements: {[key: string]: IBaseElementConfig};
    alwaysOnViewBounds: IDimension;
    pivot: IPosition;
}