import { IGameViewElementsConfig } from "./IGameViewElementsConfig";
import { IViewConfig } from "./IViewConfig";

export interface IViewsConfig {
    loadinfViewElements?: IViewConfig;
    gameViewElements: IGameViewElementsConfig;
    endViewElements?: IViewConfig; 
    menuViewElements?: IViewConfig; 
}