import * as PIXI from"pixi.js";

import { Application } from "../../../Application";
import { IGameBoardConfig } from "../interfaces/configs/gameConfig/IGameBoardConfig";
import { BaseMainViewElement } from "./BaseMainViewElement";

export class GameBoard extends BaseMainViewElement {

    private gameBoardConfig: IGameBoardConfig;

    constructor(gameBoardConfig: IGameBoardConfig) {
        super();

        this.gameBoardConfig = gameBoardConfig;

        this.createBoardView();
    }

    private createBoardView() {
        const sprite = new PIXI.Sprite(Application.APP.assetManager.gameplayAssets[this.gameBoardConfig.assetName])
        this.addChild(sprite);
    }
}