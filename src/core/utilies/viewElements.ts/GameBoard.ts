import { IGameBoardConfig } from "../interfaces/configs/IGameBoardConfig";
import { BaseMainViewElements } from "./BaseMainViewElement";

export class GameBoard extends BaseMainViewElements {

    private gameBoardConfig: IGameBoardConfig;

    constructor(gameBoardConfig: IGameBoardConfig) {
        super();

        this.gameBoardConfig = gameBoardConfig;

        this.createBoardView();
    }

    private createBoardView() {

    }
}