import * as PIXI from "pixi.js";
import gsap from "gsap";

import { IGameViewElementsConfig } from "./utilies/interfaces/configs/gameConfig/IGameViewElementsConfig";
import { Application } from "../Application";
import { GameEvents } from "./GameEvents";
import { GameplayView } from "./views/GameplayView";
import { LoadingView } from "./views/LoadingView";
import { BaseView } from "./views/BaseView";
import { StatusBarView } from "./views/StatusBarView";
import { IBaseElementConfig } from "./utilies/interfaces/configs/IBaseElementConfig";

export class MainView extends BaseView {

    private currentView: BaseView;

    private statusBar: StatusBarView;

    private views: Map<string, BaseView> = new Map();

    private viewConfig: IGameViewElementsConfig;
    private commonConfig: {[key: string]: IBaseElementConfig};

    constructor(viewConfig: IGameViewElementsConfig, commonConfig: {[key: string]: IBaseElementConfig}) {
        super();   
        
        this.viewConfig = viewConfig;
        this.commonConfig = commonConfig;

        this.sortableChildren = true;
    }

    public init() {
        Application.APP.emitter.on(GameEvents.LOAD_START_ASSETS, this.onLoadGame, this);
        Application.APP.emitter.on(GameEvents.LOAD_COMMON_ASSETS, this.createCommonUI, this);
        Application.APP.emitter.on(GameEvents.START_GAME, this.createAllViews, this);
    }

    public getViewByName(name: string) {
        if (!this.views.has(name)) {
            console.warn(`No view with name ${name}`)
            return undefined;
        }

        return this.views.get(name);
    }

    public getAllView() {
        return [...this.views.values()]
    }

    public getCurrentView() {
        return this.currentView;
    }

    public onResize(): void {
        this.statusBar.x = 0;
        this.statusBar.y = Application.APP.viewSizes.height;
        this.statusBar.onResize();
        
        this.currentView.onResize();
    }

    protected onLoadGame() {
        const loadingView = new LoadingView();
        this.currentView = loadingView;
        this.views.set("loadingView", loadingView);
        this.addChild(loadingView);
    }

    public onStartGame() {
        this.transitionTo("gameplayView");
    }

    protected onGamePause() {

    }

    protected onGameplay() {

    }

    protected onGameEnd() {
        
    }

    protected createCommonUI() {
        if (this.commonConfig["statusBar"]) {
            this.statusBar = new StatusBarView(this.commonConfig["statusBar"]);
            this.statusBar.x = 0;
            this.statusBar.y = Application.APP.viewSizes.height;
            this.addChild(this.statusBar);
            this.statusBar.zIndex = 1000;
        }
    }

    protected createAllViews() {
        if (!this.views.has("gameplayView")) {
            const gameplayView = new GameplayView(this.viewConfig);
            gameplayView.init();
            gameplayView.visible = false;
            gameplayView.alpha = 0;
            this.currentView = gameplayView;
            this.views.set("gameplayView", gameplayView);
            this.addChild(gameplayView);
        }

        Application.APP.emitter.emit(GameEvents.ALL_VIEWS_ARE_CREATED);
    }

    protected async transitionTo(nextViewName: string) {
        await gsap.to(this.currentView, {
            alpha: 0,
            onComplete: () => this.currentView.visible = false
        })

        this.currentView = this.getViewByName(nextViewName);
        this.currentView.onResize();
        this.currentView.visible = true;

        await gsap.to(this.currentView, {
            alpha: 1
        })
    }
}