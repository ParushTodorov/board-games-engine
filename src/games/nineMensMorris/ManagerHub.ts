import { BaseManagerHub } from "../../core/ManagerHub";
import { Gameplay } from "./Gameplay";

export class ManagerHub extends BaseManagerHub {

    constructor() {
        super();

        this.gameplay = new Gameplay();
    }
}