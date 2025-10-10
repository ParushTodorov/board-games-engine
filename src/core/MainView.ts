import * as PIXI from "pixi.js";
import { IGameViewElementsConfig } from "./utilies/interfaces/configs/IGameViewElementsConfig";
import { Application } from "../Application";
import { GameEvents } from "./GameEvents";
import { GameplayView } from "./views/GameplayView";
import { LoadingView } from "./views/LoadingView";
import gsap from "gsap";
import { BaseView } from "./views/BaseView";

export class MainView extends BaseView {

    private currentView: BaseView;

    private views: Map<string, BaseView> = new Map();

    private viewConfig: IGameViewElementsConfig;

    constructor(viewConfig: IGameViewElementsConfig) {
        super();   
        
        this.viewConfig = viewConfig;
    }

    public init() {
        Application.APP.emitter.on(GameEvents.LOAD_START_ASSETS, this.onLoadGame, this);
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

    protected onLoadGame() {
        const loadingView = new LoadingView();
        this.currentView = loadingView;
        this.views.set("loadingView", loadingView);
        this.addChild(loadingView);
    }

    public onStartGame() {
        this.transitionTo("gameplayView");
    }

    public onResize(): void {
        this.currentView.onResize();
    }

    protected onGamePause() {

    }

    protected onGameplay() {

    }

    protected onGameEnd() {
        
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