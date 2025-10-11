import { IAssetsBundles } from "../IAssetsBundles";
import { IGameViewElementsConfig } from "./IGameViewElementsConfig";

export interface IGameConfig {
    gameInfo: {
        game: string;
        gameToken: string;
    },
    assets: IAssetsBundles;
    gameViewElements: IGameViewElementsConfig;
}
