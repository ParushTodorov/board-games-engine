import { IBackgroundConfig } from "../interfaces/configs/IBackgroundConfig";
import { BaseMainViewElements } from "./BaseMainViewElement";

export class Background extends BaseMainViewElements {
    private gameBoardConfig: IBackgroundConfig;

    constructor(gameBoardConfig: IBackgroundConfig) {
        super();

        this.gameBoardConfig = gameBoardConfig;

        this.createBackground();
    }

    private createBackground() {

    }
}