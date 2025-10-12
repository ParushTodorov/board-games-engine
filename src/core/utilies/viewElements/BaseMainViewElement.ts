import * as PIXI from "pixi.js";
import { IMainViewElements } from "../interfaces/common/IMainViewElements";
import { Application } from "../../../Application";

export class BaseMainViewElement extends PIXI.Container {

    protected app: Application;

    constructor() {
        super();

        this.app = Application.APP;
        // to add: pixi.app
    }
}