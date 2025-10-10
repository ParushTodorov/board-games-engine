import * as PIXI from "pixi.js"
import { IAssetsBundles } from "../utilies/interfaces/configs/IAssetsBundles"
import { GameEvents } from "../GameEvents";
import { Application } from "../../Application";

export class AssetManager {

    public loadingAssets: any;

    public gameplayAssets: any;
    
    public async loadAssets(manifest: IAssetsBundles) {
        PIXI.Assets.init({ manifest });

        this.loadingAssets = await PIXI.Assets.loadBundle("loading_view");

        Application.APP.emitter.emit(GameEvents.LOAD_START_ASSETS);

        PIXI.Assets.loadBundle("gameplay_view", (progress) => {
            console.log(`Loading: ${Math.round(progress * 100)}%`);
        }).then((value) => {
            this.gameplayAssets = value
            Application.APP.emitter.emit(GameEvents.START_GAME);
        });
    }

}