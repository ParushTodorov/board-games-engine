import { Application } from "../Application";
import { GameEvents } from "./GameEvents";
import { PlayerManager } from "./playerManager/PlayerManager";
import { GameStates } from "./utilies/enums/GameStates";

export class BaseGameplay {

    protected app: Application;
    protected playerManager: PlayerManager;

    private currentGameState: GameStates;
    private lastGameState: GameStates;

    constructor() {
        this.currentGameState = GameStates.Loading;
        this.lastGameState = GameStates.None;
    }

    public init() {
        this.app = Application.APP;
        this.playerManager = this.app.playerManager;
        Application.APP.emitter.on(GameEvents.ALL_VIEWS_ARE_CREATED, this.setStartView, this);
    }

    public changeGameState(gameState: GameStates) {
        this.lastGameState = this.currentGameState;
        this.currentGameState = gameState;

        switch (gameState) {
            case GameStates.Start:
                this.setStartView();
                break;
            case GameStates.Gameplay:
                this.setGameplayView();
                break;
            case GameStates.End:
                this.setEndView();
                break;
            case GameStates.Pause:
                this.setPauseView();
                break;
            default:
                break;
        }
    }

    protected setStartView() {
        this.changeGameState(GameStates.Gameplay);
        Application.APP.mainView.onStartGame();
    }

    protected setGameplayView() {

    }

    protected setEndView() {

    }

    protected setPauseView() {

    }

    protected onStartNewGame() {
        this.changeGameState(GameStates.Start);
    }

    protected onEndGame() {
        this.changeGameState(GameStates.End);
    }

    protected onPauseGame() {
        this.changeGameState(GameStates.Pause);
    }

    protected onResumeGame() {
        this.changeGameState(this.lastGameState);
    }
}