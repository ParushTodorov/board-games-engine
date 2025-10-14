import * as PIXI from 'pixi.js'
import { MainView } from './core/managers/MainView';
import { BaseGameplay } from './core/managers/Gameplay';
import { IGameConfig } from './core/utilies/interfaces/configs/gameConfig/IGameConfig';
import { AssetManager } from './core/managers/AssetManager';
import { PlayerManager } from './core/managers/PlayerManager';

import commonConfig from './core/CommonConfig.json';
import { IManagerHub } from './core/utilies/interfaces/configs/IManagerHub';
import { GameplayElementsManager } from './core/managers/GameplayElementsManager';

type ICommonConfig = typeof commonConfig;

export class Application {
    public static APP: Application;

    public pixiApp!: PIXI.Application;
    public emitter: PIXI.EventEmitter;

    public managerHub: IManagerHub;

    public mainView: MainView;
    public gameplay: BaseGameplay;
    public playerManager: PlayerManager;
    public assetManager: AssetManager;
    public gameplayManager: GameplayElementsManager;

    public viewSizes: {width: number, height: number, isLandscape: () => boolean} = {width: 0, height: 0, isLandscape: () => this.viewSizes.width > this.viewSizes.height};

    public gameConfig: IGameConfig;
    public commonConfig: ICommonConfig;

    constructor(managerHub: IManagerHub, gameConfig: IGameConfig) {
        Application.APP = this;
        
        this.gameConfig = gameConfig;
        this.commonConfig = commonConfig;
        
        this.mainView = managerHub.mainView;
        this.gameplay = managerHub.gameplay;
        this.playerManager = managerHub.playerManager;
        this.gameplayManager = managerHub.gameplayElementsManager
    }
    
    public async init() {
        await this.createPixiApplication();

        this.mainView.init(this.gameConfig.views, this.commonConfig.elements);
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