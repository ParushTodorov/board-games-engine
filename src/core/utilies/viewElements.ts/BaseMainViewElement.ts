import * as PIXI from "pixi.js";
import { IMainViewElements } from "../interfaces/common/IMainViewElements";

export class BaseMainViewElements extends PIXI.Container implements IMainViewElements {


    constructor() {
        super();

        // to add: pixi.app
    }

    public onResize(): void {
        
    }
}