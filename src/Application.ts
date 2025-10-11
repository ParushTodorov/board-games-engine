import * as PIXI from 'pixi.js'
import { MainView } from './core/MainView';
import { BaseGameplay } from './core/Gameplay';
import { IGameConfig } from './core/utilies/interfaces/configs/gameConfig/IGameConfig';
import { AssetManager } from './core/assets/AssetManager';
import { PlayerManager } from './core/playerManager/PlayerManager';

import commonConfig from './core/CommonConfig.json';

type ICommonConfig = typeof commonConfig;

export class Application {
    public static APP: Application;

    public pixiApp!: PIXI.Application;
    public emitter: PIXI.EventEmitter;
    public mainView: MainView;
    public gameplay: BaseGameplay;
    public playerManager: PlayerManager;
    public assetManager: AssetManager;

    public viewSizes: {width: number, height: number} = {width: 0, height: 0};

    protected gameConfig: IGameConfig;
    protected commonConfig: ICommonConfig;

    constructor(gameplay: BaseGameplay, gameConfig: IGameConfig) {
        this.gameConfig = gameConfig;
        this.commonConfig = commonConfig;
        
        this.mainView = new MainView(this.gameConfig.gameViewElements, this.commonConfig.elements);
        this.gameplay = gameplay;
        this.playerManager = new PlayerManager();
    }
    
    public async init() {
        Application.APP = this;

        await this.createPixiApplication();

        this.mainView.init();
        this.pixiApp.stage.addChild(this.mainView);

        this.gameplay.init();

        await this.loadStaticFiles();
        
        this.resizeObserver();
    }

    private async createPixiApplication() {
        const {width, height} = window.visualViewport!;
        this.pixiApp = new PIXI.Application();
        await this.pixiApp.init();

        (<any>globalThis).__PIXI_APP__ = this.pixiApp;
        const div = document.createElement('div');
        div.id = 'app';
        div.appendChild(this.pixiApp.canvas);
        document.body.appendChild(div);

        this.viewSizes.width = width;
        this.viewSizes.height = height;

        this.pixiApp.renderer.resize(this.viewSizes.width, this.viewSizes.height);

        this.emitter = new PIXI.EventEmitter();
    }

    private async loadStaticFiles() {
        this.assetManager = new AssetManager();

        const bundles = [...this.commonConfig.assets.bundles, ... this.gameConfig.assets.bundles];
        const manifest = {
            "bundles": bundles
        };

        this.assetManager.addManifest(manifest);

        await this.assetManager.initialLoad();
        this.assetManager.loadAssets();
    }

    private resizeObserver() {
        const container = document.body;
        this.pixiApp.ticker.add(() => {
            const width = container.clientWidth;
            const height = container.clientHeight;

            if (height === this.viewSizes.height && width === this.viewSizes.width) return;

            this.viewSizes.width = width;
            this.viewSizes.height = height;

            this.onResize();
        })
    }

    private onResize() {
        this.pixiApp.renderer.resize(this.viewSizes.width, this.viewSizes.height);
        this.mainView.onResize();
    }
}