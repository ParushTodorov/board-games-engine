import { BaseManagerHub } from "../../core/ManagerHub";
import { Gameplay } from "./Gameplay";
import { MainView } from "./MainView";

export class ManagerHub extends BaseManagerHub {

    constructor() {
        super();

        this.gameplay = new Gameplay();
        this.mainView = new MainView();
    }
}