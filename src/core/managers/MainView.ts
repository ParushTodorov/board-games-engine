import * as PIXI from "pixi.js";
import gsap from "gsap";

import { IGameViewElementsConfig } from "../utilies/interfaces/configs/gameConfig/IGameViewElementsConfig";
import { Application } from "../../Application";
import { GameEvents } from "../GameEvents";
import { GameplayView } from "../views/GameplayView";
import { EndView } from "../views/EndView";
import { LoadingView } from "../views/LoadingView";
import { BaseView } from "../views/BaseView";
import { StatusBarView } from "../views/StatusBarView";
import { IBaseElementConfig } from "../utilies/interfaces/configs/IBaseElementConfig";
import { IViewsConfig } from "../utilies/interfaces/configs/gameConfig/IViewsConfig";

export class MainView extends BaseView {

    private currentView: BaseView;

    private statusBar: StatusBarView;

    private views: Map<string, BaseView> = new Map();

    private viewConfig: IViewsConfig;
    private commonConfig: {[key: string]: IBaseElementConfig};

    constructor() {
        super();   
    }

    public init(viewConfig: IViewsConfig, commonConfig: {[key: string]: IBaseElementConfig}) {
        this.viewConfig = viewConfig;
        this.commonConfig = commonConfig;

        this.sortableChildren = true;

        this.app.emitter.on(GameEvents.LOAD_START_ASSETS, this.onLoadGame, this);
        this.app.emitter.on(GameEvents.LOAD_COMMON_ASSETS, this.createCommonUI, this);
        this.app.emitter.on(GameEvents.LOAD_GAMEPLAY_ASSETS, this.createAllViews, this);
        this.app.emitter.on(GameEvents.START_GAME, this.onStartGame, this);
        this.app.emitter.on(GameEvents.GAME_END, this.onGameEnd, this);
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
        this.statusBar.y = this.app.viewSizes.height;
        this.statusBar.onResize();
        
        this.currentView.onResize();
    }

    protected onLoadGame() {
        const loadingView = new LoadingView();
        this.currentView = loadingView;
        this.views.set("loadingView", loadingView);
        this.addChild(loadingView);
    }

    public async onStartGame() {
        await this.transitionTo("gameplayView");
        await this.show(this.statusBar);
    }

    protected onGamePause() {

    }

    protected onGameplay() {

    }

    protected async onGameEnd() {
        await this.transitionTo("endView");
    }

    protected createCommonUI() {
        if (this.commonConfig["statusBar"]) {
            this.statusBar = new StatusBarView(this.commonConfig["statusBar"]);
            this.statusBar.x = 0;
            this.statusBar.y = this.app.viewSizes.height;
            this.statusBar.visible = false;
            this.addChild(this.statusBar);
            this.statusBar.zIndex = 1000;
        }
    }

    protected createAllViews() {
        if (!this.views.has("gameplayView")) {
            const gameplayView = new GameplayView(this.viewConfig.gameViewElements);
            gameplayView.init();
            gameplayView.visible = false;
            gameplayView.alpha = 0;
            this.views.set("gameplayView", gameplayView);
            this.addChild(gameplayView);
        }

        if (!this.views.has("endView")) {
            const endView = new EndView(this.viewConfig.endViewElements);
            // endView.init();
            endView.visible = false;
            endView.alpha = 0;
            endView.interactive = true;
            endView.on('pointerup', () => {
                this.app.emitter.emit(GameEvents.START_NEW_GAME);        
            })
            this.views.set("endView", endView);
            this.addChild(endView);
        }

        this.app.emitter.emit(GameEvents.START_NEW_GAME);
    }

    protected async transitionTo(nextViewName: string) {
        await this.hide(this.currentView);

        this.currentView = this.getViewByName(nextViewName);
        await this.show(this.currentView);
    }

    protected async show(view: BaseView) {
        view.onResize();
        view.alpha = 0;
        view.visible = true;

        await gsap.to(view, {
            alpha: 1
        })
    }

    protected async hide(currentView: BaseView) {
        await gsap.to(currentView, {
            alpha: 0,
            onComplete: () => currentView.visible = false
        })
    }
}