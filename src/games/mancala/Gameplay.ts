import { Point } from "pixi.js";
import { Application } from "../../Application";
import { GameEvents } from "../../core/GameEvents";
import { BaseGameplay } from "../../core/Gameplay";
import { Player } from "../../core/playerManager/Player";
import { PlayerManager } from "../../core/playerManager/PlayerManager";
import { GameComponent } from "../../core/utilies/viewElements/GameComponent";
import { Gorge } from "../../core/utilies/viewElements/Gorge";
import { GameplayView } from "../../core/views/GameplayView";
import { GorgeType } from "./utilits/GorgeType";

export class Gameplay extends BaseGameplay {
    private INIT_GAMECOMPONENTS_PER_GORGE: number = 4;
    
    private gameView: GameplayView;
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

        this.app.emitter.on(GameEvents.TOUCH_TO_MOVE, this.onTouchToMove, this);

        this.app.playerManager.addPlayer(new Player());
        this.app.playerManager.addPlayer(new Player());
    }

    protected setStartView(): void {
        if (!this.gameView) {
            this.gameView = this.app.mainView.getViewByName("gameplayView") as GameplayView;
        }

        const gorges: Gorge[] = this.gameView.getAllElementsByType("gorge") as Gorge[];
        const gameComponents: GameComponent[] = this.gameView.getAllElementsByType("gameComponent") as GameComponent[];

        if (gameComponents.length != 48) {
            console.warn("There must be 48 game components for this games");
            return;
        }

        if (gorges.length != 14) {
            console.warn("There must be 14 game components for this games");
            return;
        }

        gorges.forEach((gorge) => {
            gorge.removeAllGameComponents();

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

        super.setStartView();
    }

    private async onTouchToMove(e: {startElement: string, element: string}): Promise<void> {
        if (e.startElement.includes("side")) return;

        const startElement: Gorge = this.gameView.getSingleElementByNameAndType(e.startElement, "gorge") as Gorge;
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

            const newGorge: Gorge = this.gameView.getSingleElementByNameAndType(gorgeName, "gorge") as Gorge;
            await this.moveBallToNewGoroge(gameComponent, newGorge);
            
            if (Number.isInteger(id) && i === gameComponents.length - 1 && newGorge.getAllCurrentGameComponents().length === 1) {
                this.tryToCaptureOppositeBalls(newGorge, id as number);
            }
        }
        
        if (this.capturedBalls === 48) {
            console.log("WINNER WINNER!!!")
        };

        await this.finishTheMove(currentIndex, currentGorgeBall);
    }

    private async moveBallToNewGoroge(gameComponent: GameComponent, newGorge: Gorge) : Promise<Point> {
            const finalDestination = newGorge.getNextElementPosition();
            await gameComponent.move(finalDestination);
            newGorge.addNewGameComponent(gameComponent);

            if (newGorge.getName().includes('side')) {
                this.capturedBalls++
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
        const correspondingGorge = this.gameView.getSingleElementByNameAndType(this.createGorgeName("smallGorge", correspondingGorgeNumber), "gorge") as Gorge;
        const correspondGameComponents = correspondingGorge.removeAllGameComponents();

        if (correspondGameComponents.length === 0) return;

        const winnerGorgeID = playerOnTurnId === 1 ? 1 : 0 ;
        const winnerGorgeName = this.createGorgeName("sideGorge", winnerGorgeID);
        const winnerGorge: Gorge = this.gameView.getSingleElementByNameAndType(winnerGorgeName, "gorge") as Gorge;

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

            totalCount += (this.gameView.getSingleElementByNameAndType(this.createGorgeName("smallGorge", id), "gorge") as Gorge).getAllCurrentGameComponents().length;
        })

        console.log("current: ", this.playerManager.playerOnTurnId(), " next: ", this.playerManager.nextPlaterId(), " gorges: ", this.gorgeOwner[playerId], " total: ", totalCount)

        return totalCount === 0;
    }

    private createGorgeName(gorgeType: GorgeType, id: string | number): string {
        return `${gorgeType}-${id}`;
    }
}