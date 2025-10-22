import * as PIXI from "pixi.js";

import { GameEvents } from "../../core/utilies/GameEvents";
import { BaseGameplay } from "../../core/managers/Gameplay";
import { Gorge } from "../../core/utilies/viewElements/Gorge";
import { GameComponent } from "../../core/utilies/viewElements/GameComponent";
import { Player } from "../../core/utilies/playerManager/Player";
import { GamePhases } from "./utilis/GamePhases";
import { millsMap } from "./utilis/MillsMap";
import { nodeMap } from "./utilis/NodeMap";
import { Occupation } from "../../core/utilies/enums/Occupation";
import { FederatedPointerEvent } from "pixi.js";

export class Gameplay extends BaseGameplay {
    private playerGameComponents: {[key: number]: GameComponent[]} = {
        1: [],
        2: []
    }

    private gamePhase: {[key: number]: GamePhases} = {
        1: GamePhases.Placing,
        2: GamePhases.Placing
    }

    private playerIdToNameMap: {[key: number]: string} = {
        1: "playerOne",
        2: "playerTwo"
    }

    private isMillActivated: boolean = false;

    private startGameComponentsOffset = 5;

    constructor() {
        super();
    }

    public init() {
        super.init();

        this.app.emitter.on(GameEvents.GORGE_UP, this.onGorgeTouch, this);
        this.app.emitter.on(GameEvents.GAME_COMPONENT_UP, this.onTouchToMove, this);
        this.app.emitter.on(GameEvents.GAME_COMPONENT_DOWN, this.onDragStart, this);

        this.app.playerManager.addPlayer(new Player());
        this.app.playerManager.addPlayer(new Player());
    }

    protected onStartNewGame(): void {
        if (!this.gameplayElementsManager) {
            this.gameplayElementsManager = this.app.gameplayManager;
        }

        if (!this.dragManager) {
            this.dragManager = this.app.dragManager;
            this.dragManager.init();
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

        const {x, y, width} = this.app.gameplayManager.getCurrentBoard();

        gameComponents.forEach(gameComponent => {
            gameComponent.visible = true;
            gameComponent.interactive = false;

            if (gameComponent.getName().includes('playerOne')) {
                gameComponent.x = x - gameComponent.width - this.startGameComponentsOffset;
                gameComponent.y = y + (this.playerGameComponents[1].length) * (gameComponent.height + this.startGameComponentsOffset);
                this.playerGameComponents[1].push(gameComponent);
                return;
            }

            gameComponent.x = x + width + this.startGameComponentsOffset;
            gameComponent.y = y + (this.playerGameComponents[2].length) * (gameComponent.height + this.startGameComponentsOffset);
            this.playerGameComponents[2].push(gameComponent);
        });

        gorges.forEach((gorge, index) => {
            gorge.removeAllGameComponents();
            this.dragManager.setOccupation(index, Occupation.Empty);
        });

        this.playerManager.startGame();
        this.showCurrentPlayer();

        this.gamePhase = {
            1: GamePhases.Placing,
            2: GamePhases.Placing
        };

        super.onStartNewGame();
    }

    protected async onGorgeTouch(event: any, gorgeName: string) {
        if (this.isMillActivated || this.gamePhase[this.playerManager.playerOnTurnId()] != GamePhases.Placing) return;

        this.onPlacingPhase(gorgeName);
    }

    protected async onDragStart(event: FederatedPointerEvent, startElement: string, element: string) {
        if (this.gamePhase[this.playerManager.playerOnTurnId()] === GamePhases.Placing || this.isMillActivated) return;

        const gameComponent: GameComponent = this.gameplayElementsManager.getSingleElementByNameAndType(element, "gameComponent") as GameComponent;

        if (!this.isGameCompomemtOwnedByCurrentPlayerTurn(gameComponent)) return;

        this.dragManager.startDragging(gameComponent);
    }

    protected async onTouchToMove(event: any, startElement: string, element: string) {
        const gameComponent: GameComponent = this.gameplayElementsManager.getSingleElementByNameAndType(element, 'gameComponent') as GameComponent;

        if (!this.isMillActivated) {
            switch(this.gamePhase[this.playerManager.playerOnTurnId()]) {
                case GamePhases.Moving:
                    return this.onMovingPhase(gameComponent);
                case GamePhases.Flying:
                    return this.onFlyingPhase(gameComponent);
                default:
                    return;
            }
        };    

        if (this.isGameCompomemtOwnedByCurrentPlayerTurn(gameComponent)) return;

        const isGameComponentCaptured = await this.isGameComponentCaptured(gameComponent);
                
        if (!isGameComponentCaptured) return;

        this.isMillActivated = false;
        this.finishPlayerTurn();
    }

    private async onPlacingPhase(gorgeName: string) {
        const gorge: Gorge = this.gameplayElementsManager.getSingleElementByNameAndType(gorgeName, 'gorge') as Gorge;

        if (!gorge || gorge.getElementsCount() || this.playerGameComponents[this.playerManager.playerOnTurnId()].length === 0) return;

        const gameComponent = this.playerGameComponents[this.playerManager.playerOnTurnId()].pop()!;
        gorge.addNewGameComponent(gameComponent);
        this.dragManager.setOccupation(gorge.getId(), this.playerManager.playerOnTurnId());
        
        const finalPosition = {
            x: gorge.position.x - gameComponent.width / 2,
            y: gorge.position.y - gameComponent.height / 2
        }

        await gameComponent.move(finalPosition);
        this.app.emitter.emit(GameEvents.PLAY_SOUND, "movingSound");
        gameComponent.interactive = true;

        if (this.isMill(gorge.getId(), this.playerManager.playerOnTurnId())) {
            return;
        } 
        
        this.finishPlayerTurn();
    }

    private async onMovingPhase(gameComponent: GameComponent) {
        const canBeOccupied: (startId: number, endId: number) => boolean = (startId, endId) => {
            return this.dragManager.getOccupation(endId) === Occupation.Empty && nodeMap[startId].includes(endId);
        }

        this.dragManager.canBeOccupied = canBeOccupied;

        if (!await this.onDragMoveEnd(gameComponent)) return;

        this.finishPlayerTurn();
    }

    private async onFlyingPhase(gameComponent: GameComponent) {
        const canBeOccupied: (startId: number, endId: number) => boolean = (startId, endId) => {
            return this.dragManager.getOccupation(endId) === Occupation.Empty;
        }

        this.dragManager.canBeOccupied = canBeOccupied;

        if (!await this.onDragMoveEnd(gameComponent)) return;

        this.finishPlayerTurn();
    }

    private async onDragMoveEnd(gameComponent: GameComponent): Promise<boolean> {        
        let isTurnEnded = await this.dragManager.stopDragging(gameComponent);

        if (isTurnEnded && this.isMill((gameComponent.getGorgeOwner() as Gorge).getId(), this.playerManager.playerOnTurnId())) {
            isTurnEnded = false;
        } 

        return isTurnEnded;
    }

    private finishPlayerTurn() {
        const currnetPlayer = this.playerManager.playerOnTurnId();
        const nextPlayer = this.playerManager.nextPlaterId();

        if (this.playerGameComponents[currnetPlayer].length === 0 && this.playerGameComponents[nextPlayer].length === 0 && this.gamePhase[currnetPlayer] === GamePhases.Placing) {
            this.gamePhase[currnetPlayer] = GamePhases.Moving;
            this.gamePhase[nextPlayer] = GamePhases.Moving;
            this.app.emitter.emit(GameEvents.NEW_MESSAGE, 'It is moving pieces phase', 2000);
        }

        const nextPlayerGameComponentsCount: number = Object.values(this.dragManager.getOccupationMap()).filter(o => o === nextPlayer).length;

        if (nextPlayerGameComponentsCount === 3 && this.gamePhase[nextPlayer] === GamePhases.Moving) {
            this.gamePhase[nextPlayer] = GamePhases.Flying;
            this.app.emitter.emit(GameEvents.NEW_MESSAGE, `It is flying pieces phase for ${nextPlayer}`, 2000);
        }

        if (nextPlayerGameComponentsCount < 3 && (this.gamePhase[currnetPlayer] === GamePhases.Flying || this.gamePhase[nextPlayer] === GamePhases.Flying)) {
            this.app.emitter.emit(GameEvents.NEW_MESSAGE, `${currnetPlayer} is a winner!!!`);
            this.app.emitter.emit(GameEvents.GAME_END);
            return;
        }

        this.changePlayerTurn(); 
    }

    private async isGameComponentCaptured(gameComponent: GameComponent) {
        if (!this.isCapturedPosible()) {
            this.app.emitter.emit(GameEvents.NEW_MESSAGE, `No pools outside the mills!`, 2000);
            return true;
        }

        const gorge: Gorge = gameComponent.getGorgeOwner()!;

        if (!gorge.getElementsCount()) {
            gorge.addNewGameComponent(gameComponent);
        }
        
        if (!gorge || this.dragManager.getOccupation(gorge.getId()) === this.playerManager.playerOnTurnId()) return false;

        if (this.isMill(gorge.getId(), this.playerManager.nextPlaterId())) return false;

        gorge.removeAllGameComponents();
        this.dragManager.setOccupation(gorge.getId(), Occupation.Empty);

        await gameComponent.move({x: 0, y: 0}, () => {gameComponent.visible = false});
        
        return true;
    }

    private isMill(gorgeId: number, player: number) {
        const mills = millsMap.filter(mill => mill.includes(gorgeId));

        let result = false;

        mills.forEach(mill => {
            let isMill = true;

            mill.forEach(m => {
                if (this.dragManager.getOccupation(m) != player) {
                    isMill = false;
                    return;
                }
            });

            if (isMill) {
                this.playerManager.playerOnTurnId() === player && this.app.emitter.emit(GameEvents.NEW_MESSAGE, "CAPTURE!!!", 2000);
                this.isMillActivated = true;
                result = true;
            }
        })

        return result;
    }

    private isGameCompomemtOwnedByCurrentPlayerTurn(gameComponent: GameComponent) {
        const currentPlayerName = this.playerIdToNameMap[this.playerManager.playerOnTurnId()];

        return gameComponent.getName().includes(currentPlayerName);
    }

    private changePlayerTurn(): void {
        this.playerManager.turnEnd();
        this.showCurrentPlayer();
    }

    private isCapturedPosible() {
        const nextPlayer = this.playerManager.nextPlaterId();
        const currentMills: [number, number, number][]= [];

        const occupiedArray: [string, Occupation][] = Object.entries(this.dragManager.getOccupationMap()).filter(o => o[1] === nextPlayer);
        let counter: number = 0;

        occupiedArray.forEach(occupied => {
            const gorgeId = Number.parseInt(occupied[0]);

            if (currentMills.filter(mill => mill.includes(gorgeId)).length > 0) {
                counter++;
                return;
            };

            const mills = millsMap.filter(mill => mill.includes(gorgeId));

            mills.forEach(mill => {
                let isMill = true;

                mill.forEach(m => {
                    if (this.dragManager.getOccupation(m) != nextPlayer) {
                        isMill = false;
                        return;
                    }
                });

                if (isMill) {
                    counter++;
                    currentMills.push(mill);
                }
            })
        })

        if (counter != occupiedArray.length) {
            return true;
        }

        return false;
    }

    private showCurrentPlayer() {
        this.app.emitter.emit(GameEvents.PLAYER_CHANGE, this.playerManager.playerOnTurnId());
    }
}