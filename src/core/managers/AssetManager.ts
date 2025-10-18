 import * as PIXI from "pixi.js"
import { IAssetsBundles } from "../utilies/interfaces/configs/IAssetsBundles"
import { GameEvents } from "../utilies/GameEvents";
import { Application } from "../../Application";
import { Howl } from "howler";

export class AssetManager {

    public loadingAssets: any;

    public commonAssets: any;
    public gameplayAssets: any;

    private audioManifest: Record<string, string> = {};
    private readonly audioMap: Record<string, Howl> = {};

    public addManifest(manifest: IAssetsBundles) {
        PIXI.Assets.init({ manifest });

        manifest.bundles.forEach((bundle) => {
            if (bundle.name != "auido_assets") return;

            bundle.assets.forEach(asset => {
                this.audioManifest[asset.alias] = asset.src;
            })
        })
    }

    public async initialLoad() {
        this.loadingAssets = await PIXI.Assets.loadBundle("loading_view");
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

    public async getAudio(audioName: string | undefined): Promise<Howl> {
        if (this.audioMap[audioName]) {
            return this.audioMap[audioName];
        }

        const src = this.audioManifest[audioName];

        const howlAudio = new Howl({
            src: [src],
        });

        this.audioMap[audioName] = howlAudio;

        return this.audioMap[audioName];
    };
}