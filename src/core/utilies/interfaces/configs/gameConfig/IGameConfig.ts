import { IAssetsBundles } from "../IAssetsBundles";
import { IViewsConfig } from "./IViewsConfig";

export interface IGameConfig {
    gameInfo: {
        game: string;
        gameToken: string;
    },
    assets: IAssetsBundles;
    views: IViewsConfig;
}
