import { Point } from "pixi.js";
import { Application } from "../../Application";
import { GameEvents } from "../../core/utilies/GameEvents";
import { BaseGameplay } from "../../core/managers/Gameplay";
import { Player } from "../../core/utilies/playerManager/Player";
import { PlayerManager } from "../../core/managers/PlayerManager";
import { GameComponent } from "../../core/utilies/viewElements/GameComponent";
import { Gorge } from "../../core/utilies/viewElements/Gorge";
import { GameplayView } from "../../core/views/GameplayView";
import { GorgeType } from "./utilits/GorgeType";
import { GameStates } from "../../core/utilies/enums/GameStates";
import { GameplayElementsManager } from "../../core/managers/GameplayElementsManager";

export class Gameplay extends BaseGameplay {
    private INIT_GAMECOMPONENTS_PER_GORGE: number = 4;
    private MAX_BALLS: number = 48; 

    private gorgeSequence = [0, 1, 2, 3, 4, 5, "right", 6, 7, 8, 9, 10, 11, "left"];

    private gorgeOwner: { [key: number]: number[]} = {
        1: [0, 1, 2, 3, 4, 5],
        2: [6, 7, 8, 9, 10, 11]
    }
    private sideGrorgeToPlayerMap: {[key: string]: number} = {
        "right": 1,
        "left": 2
    }

    private capturedBalls: number = 0;

    public init() {
        super.init();

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

        if (gameComponents.length != 48) {
            console.warn("There must be 48 game components for this games");
            return;
        }

        if (gorges.length != 14) {
            console.warn("There must be 14 game components for this games");
            return;
        }

        gorges.forEach((gorge) => gorge.removeAllGameComponents());

        gorges.forEach((gorge) => {
            if (gorge.getName().includes("sideGorge")) return;

            for (let i=0; i < this.INIT_GAMECOMPONENTS_PER_GORGE; i++) {
                const gameComponent = gameComponents.pop();

                const {x, y} = gorge.getNextElementPosition();
                gorge.addNewGameComponent(gameComponent);

                gameComponent.x = x;
                gameComponent.y = y;
            }
        })

        this.capturedBalls = 0;
        this.playerManager.startGame();
        this.showCurrentPlayer();

        super.onStartNewGame();
    }

    private async onTouchToMove(e: {startElement: string, element: string}): Promise<void> {
        if (this.currentGameState != GameStates.Gameplay || e.startElement.includes("side")) return;

        const startElement: Gorge = this.gameplayElementsManager.getSingleElementByNameAndType(e.startElement, "gorge") as Gorge;
        const startId = Number.parseInt(startElement.getName().split("-")[1]);
        const playerOnTurnId = this.playerManager.playerOnTurnId();

        if (!this.gorgeOwner[playerOnTurnId].includes(startId)) return;

        const gameComponents = startElement.removeAllGameComponents();

        let currentIndex: number = this.gorgeSequence.indexOf(startId);
        let currentGorgeBall: number = 0;

        for( let i = 0; i < gameComponents.length; i++) {
            const gameComponent = gameComponents[i];
            currentIndex++;

            if (currentIndex === this.gorgeSequence.length) currentIndex = 0;
            
            const id = this.gorgeSequence[currentIndex];
            let gorgeName: string;

            if (Number.isInteger(id)) {
                gorgeName = this.createGorgeName('smallGorge', id);
            } else {
                gorgeName = this.createGorgeName('sideGorge', id === "left" ? 0 : 1);
            }

            const newGorge: Gorge = this.gameplayElementsManager.getSingleElementByNameAndType(gorgeName, "gorge") as Gorge;
            await this.moveBallToNewGoroge(gameComponent, newGorge);
            
            if (Number.isInteger(id) && i === gameComponents.length - 1 && newGorge.getAllCurrentGameComponents().length === 1) {
                await this.tryToCaptureOppositeBalls(newGorge, id as number);
            }
        }
        
        if (this.capturedBalls > this.MAX_BALLS / 2) {
            const playerTwoBalls = (this.gameplayElementsManager.getSingleElementByNameAndType('sideGorge-0', "gorge") as Gorge).getElementsCount();
            if (playerTwoBalls > 24) {
                this.endGame(2);
                return;
            }
            
            const playerOneBalls = (this.gameplayElementsManager.getSingleElementByNameAndType('sideGorge-1', "gorge") as Gorge).getElementsCount();
            if (playerOneBalls > 24) {
                this.endGame(1);
                return;
            }   
        };

        await this.finishTheMove(currentIndex, currentGorgeBall);
        this.showCurrentPlayer();
    }

    private async moveBallToNewGoroge(gameComponent: GameComponent, newGorge: Gorge) : Promise<Point> {
            const finalDestination = newGorge.getNextElementPosition();
            await gameComponent.move(finalDestination);
            newGorge.addNewGameComponent(gameComponent);

            // Capture no change of score
            if (newGorge.getName().includes('side')) {
                this.capturedBalls++;
                const playerGorge = newGorge.getName().includes('0') ? 2 : 1;
                this.playerManager.setScore(playerGorge, 1);
                this.app.emitter.emit(GameEvents.SCORE_CHANGE, this.playerManager.getScoreMessage());
            }

            return finalDestination;
    }

    private async finishTheMove(finalPosition: number, balls: number): Promise<void> {
        if (this.IsStillCurrentPlayerTurn(finalPosition)) {
            return;
        }
            
        this.changePlayerTurn();
    }

    private async tryToCaptureOppositeBalls(endGorge: Gorge, endGorgeNumber: number): Promise<void> {
        const playerOnTurnId = this.playerManager.playerOnTurnId();

        if (!this.gorgeOwner[playerOnTurnId].includes(endGorgeNumber))  return;
                
        const correspondingGorgeNumber = 11 - endGorgeNumber;
        const correspondingGorge = this.gameplayElementsManager.getSingleElementByNameAndType(this.createGorgeName("smallGorge", correspondingGorgeNumber), "gorge") as Gorge;
        const correspondGameComponents = correspondingGorge.removeAllGameComponents();

        if (correspondGameComponents.length === 0) return;

        const winnerGorgeID = playerOnTurnId === 1 ? 1 : 0 ;
        const winnerGorgeName = this.createGorgeName("sideGorge", winnerGorgeID);
        const winnerGorge: Gorge = this.gameplayElementsManager.getSingleElementByNameAndType(winnerGorgeName, "gorge") as Gorge;

        endGorge.removeAllGameComponents().forEach(gameComponent => {
            this.moveBallToNewGoroge(gameComponent, winnerGorge);            
        });

        for( let i = 0; i < correspondGameComponents.length; i++) {
            await this.moveBallToNewGoroge(correspondGameComponents[i], winnerGorge);
        }
    }

    private changePlayerTurn(): void {
        this.playerManager.turnEnd();
    }

    private showCurrentPlayer() {
        this.app.emitter.emit(GameEvents.PLAYER_CHANGE, this.playerManager.playerOnTurnId());
    }

    private IsStillCurrentPlayerTurn(finalPosition: number): boolean {
        const finalGorgeId = this.gorgeSequence[finalPosition];

        if (this.isPlayerMovePossible(this.playerManager.playerOnTurnId())) {
            return false;
        }

        const nextPlayerId = this.playerManager.nextPlaterId()

        if (this.playerManager.playerOnTurnId() === this.sideGrorgeToPlayerMap[finalGorgeId] || this.isPlayerMovePossible(nextPlayerId)) {
            return true;
        }

        return false;
    }

    private isPlayerMovePossible(playerId: number): boolean {
        let totalCount: number = 0;
        
        this.gorgeOwner[playerId].forEach(id => {
            if (totalCount > 0) {
                return;
            }

            totalCount += (this.gameplayElementsManager.getSingleElementByNameAndType(this.createGorgeName("smallGorge", id), "gorge") as Gorge).getAllCurrentGameComponents().length;
        })
        return totalCount === 0;
    }

    private createGorgeName(gorgeType: GorgeType, id: string | number): string {
        return `${gorgeType}-${id}`;
    }

    private endGame(winner: number) {
        this.app.emitter.emit(GameEvents.NEW_MESSAGE, `Player ${winner} is the winner!`);
        this.app.emitter.emit(GameEvents.GAME_END);
    }
}