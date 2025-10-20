import * as PIXI from "pixi.js";
import { IDimension } from "../interfaces/common/IDimension";


export function isCollision(point: PIXI.Point, dimension: IDimension) {
    if ((dimension.x - dimension.width / 2) < point.x 
        && point.x < (dimension.x + dimension.width / 2) 
        && (dimension.y - dimension.width / 2) < point.y 
        && point.y < (dimension.y + dimension.width / 2))
            return true;

    return false;
}