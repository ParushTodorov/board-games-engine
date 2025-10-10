import { IGorgeConfig } from "./IGorgeConfig";
import { IGameComponent } from "./IGameComponent";
import { IGameBoardConfig } from "./IGameBoardConfig";
import { IDimension } from "../common/IDimension";
import { IPosition } from "../common/IPosition";

export interface IGameViewElementsConfig {
    background: IGameBoardConfig;
    gameBoard:{ 
        startBoardName: string;
        boards: {
            [key: string]: IGameBoardConfig;
        };
    }
    gorge: { [key: string]: IGorgeConfig };
    gameComponents: { [key: string]: IGameComponent };
    alwaysOnViewBounds: IDimension;
    pivot: IPosition;
}