import { IGorgeConfig } from "./IGorgeConfig";
import { IGameComponent } from "./IGameComponent";
import { IGameBoardConfig } from "./IGameBoardConfig";
import { IDimension } from "../../common/IDimension";
import { IPosition } from "../../common/IPosition";
import { IBaseElementConfig } from "../IBaseElementConfig";

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
    gameLogo: IBaseElementConfig;
    alwaysOnViewBounds: IDimension;
    pivot: IPosition;
}