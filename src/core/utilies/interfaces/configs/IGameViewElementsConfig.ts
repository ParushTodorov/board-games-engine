import { IGorgeConfig } from "./IGorgeConfig";
import { IGameComponent } from "./IGameComponent";
import { IGameBoardConfig } from "./IGameBoardConfig";

export interface IGameViewElementsConfig {
    background: IGameBoardConfig;
    gameBoard: { [key: string]: IGameBoardConfig };
    gorge: { [key: string]: IGorgeConfig };
    gameComponents: { [key: string]: IGameComponent };
}