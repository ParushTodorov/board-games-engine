import { Application } from "../../Application";
import { GameEvents } from "../utilies/GameEvents";
import { PlayerManager } from "./PlayerManager";
import { GameStates } from "./../utilies/enums/GameStates";
import { GameplayElementsManager } from "./GameplayElementsManager";
import { DragManager } from "./DragManager";
export class BaseGameplay {

    protected app: Application;
    protected playerManager: PlayerManager;
    protected gameplayElementsManager: GameplayElementsManager;
    protected dragManager: DragManager;

    protected currentGameState: GameStates;
    protected lastGameState: GameStates;

    protected isMenuOpen: boolean = false;

    constructor() {
        this.currentGameState = GameStates.Loading;
        this.lastGameState = GameStates.None;
    }

    public init() {
        this.app = Application.APP;
        this.playerManager = this.app.playerManager;
        Application.APP.emitter.on(GameEvents.START_NEW_GAME, this.onStartNewGame, this);
        Application.APP.emitter.on(GameEvents.MENU_BUTTON_PRESS, this.onMenuButtonPessed, this);
    }

    public changeGameState(gameState: GameStates) {
        this.lastGameState = this.currentGameState;
        this.currentGameState = gameState;
    }

    protected onStartNewGame() {
        this.changeGameState(GameStates.Start);
        this.app.emitter.emit(GameEvents.START_GAME);
        this.changeGameState(GameStates.Gameplay);
    }

    protected onEndGame() {
        this.changeGameState(GameStates.End);
        this.app.emitter.emit(GameEvents.GAME_END);
    }

    protected onPauseGame() {
        this.changeGameState(GameStates.Pause);
        this.app.emitter.emit(GameEvents.GAME_PAUSE);
    }

    protected onResumeGame() {
        this.changeGameState(this.lastGameState);
        this.app.emitter.emit(GameEvents.GAME_RESUME);
    }

    protected onMenuButtonPessed() {
        if (this.isMenuOpen) {
            this.isMenuOpen = false;
            this.app.emitter.emit(GameEvents.CLOSE_MENU);
            return;
        }
        
        this.isMenuOpen = true;
        this.app.emitter.emit(GameEvents.OPEN_MENU);
    }
}   