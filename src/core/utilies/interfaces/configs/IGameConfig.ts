import { IAssetConfig } from "./IAssetConfig";
import { IGameViewElementsConfig } from "./IGameViewElementsConfig";


export interface IGameConfig {
    gameInfo: {
        game: string;
        gameToken: string;
    },
    assets: {
        loadingBackground: IAssetConfig;
        gameplayBackground: IAssetConfig;
        gameBoard: IAssetConfig;
        gorge: IAssetConfig;
        gameComponents: IAssetConfig;
    },
    gameViewElements: IGameViewElementsConfig
}
