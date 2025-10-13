import { Application } from "../../Application";
import { GameEvents } from "./../GameEvents";
import { PlayerManager } from "./../playerManager/PlayerManager";
import { GameStates } from "./../utilies/enums/GameStates";

export class BaseGameplay {

    protected app: Application;
    protected playerManager: PlayerManager;

    protected currentGameState: GameStates;
    protected lastGameState: GameStates;

    constructor() {
        this.currentGameState = GameStates.Loading;
        this.lastGameState = GameStates.None;
    }

    public init() {
        this.app = Application.APP;
        this.playerManager = this.app.playerManager;
        Application.APP.emitter.on(GameEvents.START_NEW_GAME, this.onStartNewGame, this);
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
        this.app.emitter.emit(GameEvents.GAME_PAUSED);
    }

    protected onResumeGame() {
        this.changeGameState(this.lastGameState);
        this.app.emitter.emit(GameEvents.GAME_RESUMED);
    }
}