import * as PIXI from "pixi.js"
import { IAssetsBundles } from "../utilies/interfaces/configs/IAssetsBundles"
import { GameEvents } from "../GameEvents";
import { Application } from "../../Application";

export class AssetManager {

    public loadingAssets: any;

    public commonAssets: any;
    public gameplayAssets: any;

    public addManifest(manifest: IAssetsBundles) {
        PIXI.Assets.init({ manifest });
    }

    public async initialLoad() {
        this.loadingAssets = await PIXI.Assets.loadBundle("loading_view");
        console.log(this.loadingAssets);
        Application.APP.emitter.emit(GameEvents.LOAD_START_ASSETS);
    }
    
    public async loadAssets() {
        await PIXI.Assets.loadBundle('common_ui', (progress) => {
            console.log(`Loading: ${Math.round(progress * 100)}%`);
        }).then((value) => {
            this.commonAssets = value
            Application.APP.emitter.emit(GameEvents.LOAD_COMMON_ASSETS);
        })

        await PIXI.Assets.loadBundle("gameplay_view", (progress) => {
            console.log(`Loading: ${Math.round(progress * 100)}%`);
        }).then((value) => {
            this.gameplayAssets = value
            Application.APP.emitter.emit(GameEvents.LOAD_GAMEPLAY_ASSETS);
        });
    }

}