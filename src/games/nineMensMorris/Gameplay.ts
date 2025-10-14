import { GameEvents } from "../../core/utilies/GameEvents";
import { BaseGameplay } from "../../core/managers/Gameplay";
import { Gorge } from "../../core/utilies/viewElements/Gorge";
import { GameComponent } from "../../core/utilies/viewElements/GameComponent";
import { Player } from "../../core/utilies/playerManager/Player";
import { GamePhases } from "./utilis/GamePhases";

export class Gameplay extends BaseGameplay {
    private playerGameComponents: {[key: number]: GameComponent[]} = {
        1: [],
        2: []
    }

    private gamePhase: GamePhases = GamePhases.Placing;

    constructor() {
        super();
    }

    public init() {
        super.init();

        this.app.emitter.on(GameEvents.GORGE_TOUCH_TO_MOVE, this.onGorgeTouch, this);
        this.app.emitter.on(GameEvents.GAME_ELEMENT_TOUCH_TO_MOVE, this.onTouchToMove, this);
        
        this.app.playerManager.addPlayer(new Player());
        this.app.playerManager.addPlayer(new Player());
    }

    protected onStartNewGame(): void {
        if (!this.gameplayElementsManager) {
            this.gameplayElementsManager = this.app.gameplayManager;
        }

        const gorges: Gorge[] = this.gameplayElementsManager.getAllElementsByType("gorge") as Gorge[];
        const gameComponents: GameComponent[] = this.gameplayElementsManager.getAllElementsByType("gameComponent") as GameComponent[];

        if (gameComponents.length != 18) {
            console.warn("There must be 18 game components for this games");
            return;
        }

        if (gorges.length != 24) {
            console.warn("There must be 24 game components for this games");
            return;
        }

        gameComponents.forEach(gameComponent => {
            console.log(gameComponent.getName());

            if (gameComponent.getName().includes('playerOne')) {
                this.playerGameComponents[1].push(gameComponent);
                return;
            }

            this.playerGameComponents[2].push(gameComponent);
        })

        gorges.forEach((gorge) => gorge.removeAllGameComponents());


        this.playerManager.startGame();
        this.showCurrentPlayer();

        this.gamePhase = GamePhases.Placing;

        super.onStartNewGame();
    }

    protected async onGorgeTouch(gorgeName: string) {
        switch(this.gamePhase) {
            case GamePhases.Placing:
                return this.onPlacingPhase(gorgeName);
            default:
                return;
        }
    }

    protected onTouchToMove(e: {startElement: string, element: string}) {
        switch(this.gamePhase) {
            case GamePhases.Moving:
                return this.onMovingPhase(e);
            case GamePhases.Flying:
                return this.onFlyingPhase(e);
            default:
                return;
        }
    }

    private async onPlacingPhase(gorgeName: string) {
        const gorge: Gorge = this.gameplayElementsManager.getSingleElementByNameAndType(gorgeName, 'gorge') as Gorge;

        if (!gorge || gorge.getElementsCount() || this.playerGameComponents[this.playerManager.playerOnTurnId()].length === 0) return;


        const gameComponent = this.playerGameComponents[this.playerManager.playerOnTurnId()].pop()!;
        gorge.addNewGameComponent(gameComponent);

        const finalPosition = {
            x: gorge.position.x - gameComponent.width / 2,
            y: gorge.position.y - gameComponent.height / 2
        }

        await gameComponent.move(finalPosition);

        this.changePlayerTurn();

        if (this.playerGameComponents[1].length === 0 && this.playerGameComponents[2].length === 0) {
            this.gamePhase = GamePhases.Moving;
            this.app.emitter.emit(GameEvents.NEW_MESSAGE, 'It is moving pieces phase', 2000);
        }
    }

    private async onMovingPhase(e: {startElement: string, element: string}) {

    }

    private async onFlyingPhase(e: {startElement: string, element: string}) {

    }

    private changePlayerTurn(): void {
        this.playerManager.turnEnd();
        this.showCurrentPlayer();
    }

    private showCurrentPlayer() {
        this.app.emitter.emit(GameEvents.PLAYER_CHANGE, this.playerManager.playerOnTurnId());
    }
}