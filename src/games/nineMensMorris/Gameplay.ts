import * as PIXI from "pixi.js";

import { GameEvents } from "../../core/utilies/GameEvents";
import { BaseGameplay } from "../../core/managers/Gameplay";
import { Gorge } from "../../core/utilies/viewElements/Gorge";
import { GameComponent } from "../../core/utilies/viewElements/GameComponent";
import { Player } from "../../core/utilies/playerManager/Player";
import { GamePhases } from "./utilis/GamePhases";
import { rawMap } from "./utilis/RawMap";
import { nodeMap } from "./utilis/NodeMap";
import { Occupation } from "./utilis/Occupation";
import { FederatedPointerEvent } from "pixi.js";
import { IDimension } from "../../core/utilies/interfaces/common/IDimension";
import { IPosition } from "../../core/utilies/interfaces/common/IPosition";

export class Gameplay extends BaseGameplay {
    private playerGameComponents: {[key: number]: GameComponent[]} = {
        1: [],
        2: []
    }

    private occupationMap: {[key: number]: Occupation} = {}
    private gamePhase: {[key: number]: GamePhases} = {
        1: GamePhases.Placing,
        2: GamePhases.Placing
    }

    private isMillActivated: boolean = false;

    private addListnerFunc?: (this: Window, ev: PointerEvent) => any;

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

        const gorges: Gorge[] = this.gameplayElementsManager.getAllElementsByType("gorge") as Gorge[];
        const gameComponents: GameComponent[] = this.gameplayElementsManager.getAllElementsByType("gameComponent") as GameComponent[];

        if(!this.gorgeDimensionMap) {
            this.creategorgeDimensionMap();
        }

        if (gameComponents.length != 18) {
            console.warn("There must be 18 game components for this games");
            return;
        }

        if (gorges.length != 24) {
            console.warn("There must be 24 game components for this games");
            return;
        }

        gameComponents.forEach(gameComponent => {
            gameComponent.x = 0;
            gameComponent.y = 0;

            if (gameComponent.getName().includes('playerOne')) {
                this.playerGameComponents[1].push(gameComponent);
                return;
            }

            this.playerGameComponents[2].push(gameComponent);
        })

        gorges.forEach((gorge) => {
            gorge.removeAllGameComponents();
        });

        this.occupationMap = {};
        for (let i=0; i< 24; i++) {
            this.occupationMap[i] = Occupation.Empty;
        }

        this.playerManager.startGame();
        this.showCurrentPlayer();

        this.gamePhase = {
            1: GamePhases.Placing,
            2: GamePhases.Placing
        };

        super.onStartNewGame();
    }

    protected async onGorgeTouch(event: any, gorgeName: string) {
        if (this.isMillActivated) return;

        switch(this.gamePhase[this.playerManager.playerOnTurnId()]) {
            case GamePhases.Placing:
                return this.onPlacingPhase(gorgeName);
            default:
                return;
        }
    }

    protected async onDragStart(event: FederatedPointerEvent, startElement: string, element: string) {
        if (this.gamePhase[this.playerManager.playerOnTurnId()] === GamePhases.Placing) return;

        const gameComponent: GameComponent = this.gameplayElementsManager.getSingleElementByNameAndType(element, "gameComponent") as GameComponent;

        if (gameComponent.getName().includes('playerTwo') && this.playerManager.playerOnTurnId() === 1) return;

        gameComponent.startDragging();

        this.addListnerFunc = (e) => {
            if (!gameComponent.isDragging()) return;

            gameComponent.moveFromGlobalPosition(new PIXI.Point(e.x, e.y));
        }

        window.addEventListener('pointermove', this.addListnerFunc)
    }

    protected async onTouchToMove(event: any, startElement: string, element: string) {
        if (!this.isMillActivated) {
            switch(this.gamePhase[this.playerManager.playerOnTurnId()]) {
                case GamePhases.Moving:
                    return this.onMovingPhase(event, startElement, element);
                case GamePhases.Flying:
                    return this.onFlyingPhase(event, startElement, element);
                default:
                    return;
            }
        };    

        const isGameComponentCaptured = this.isGameComponentCaptured(startElement, element);
                
        if (!isGameComponentCaptured) return;

        this.isMillActivated = false;
        this.finishPlayerTurn();
    }

    private async onPlacingPhase(gorgeName: string) {
        const gorge: Gorge = this.gameplayElementsManager.getSingleElementByNameAndType(gorgeName, 'gorge') as Gorge;

        if (!gorge || gorge.getElementsCount() || this.playerGameComponents[this.playerManager.playerOnTurnId()].length === 0) return;

        const gameComponent = this.playerGameComponents[this.playerManager.playerOnTurnId()].pop()!;
        gorge.addNewGameComponent(gameComponent);
        this.occupationMap[gorge.getId()] = this.playerManager.playerOnTurnId();
        
        const finalPosition = {
            x: gorge.position.x - gameComponent.width / 2,
            y: gorge.position.y - gameComponent.height / 2
        }
        await gameComponent.move(finalPosition);

        if (this.isMill(gorge.getId(), this.playerManager.playerOnTurnId())) {
            return;
        } 
        
        this.finishPlayerTurn();
    }

    private async onMovingPhase(event: any, startElement: string, element: string) {
        const canBeOccupied: (startId: number, endId: number) => boolean = (startId, endId) => {
            return this.occupationMap[endId] === Occupation.Empty && nodeMap[startId].includes(endId);
        }

        const isTurnEnded = await this.onDragMoveEnd(event, startElement, element, canBeOccupied);

        if (!isTurnEnded) return;

        this.finishPlayerTurn();
    }

    private async onFlyingPhase(event: any, startElement: string, element: string) {
        const canBeOccupied: (startId: number, endId: number) => boolean = (startId, endId) => {
            return this.occupationMap[endId] === Occupation.Empty;
        }

        const isTurnEnded = await this.onDragMoveEnd(event, startElement, element, canBeOccupied);

        if (!isTurnEnded) return;

        this.finishPlayerTurn();
    }

    private async onDragMoveEnd(event: any, startElement: string, element: string, canBeOccupied: (startId: number, endId: number) => boolean) {
        if (!this.addListnerFunc) return;

        let isTurnEnded = false;

        window.removeEventListener('pointermove', this.addListnerFunc!);
        this.addListnerFunc = undefined;

        const gameComponent: GameComponent = this.gameplayElementsManager.getSingleElementByNameAndType(element, "gameComponent") as GameComponent;
        gameComponent.stopDragging();
        
        let gorge: Gorge = this.gameplayElementsManager.getSingleElementByNameAndType(gameComponent.getGorgeOwner(), 'gorge') as Gorge;        
        
        let { x, y } = gameComponent;

        x += gameComponent.width / 2;
        y += gameComponent.height / 2;

        const gorgeName: string | undefined = this.testCollision(new PIXI.Point(x, y));
        const id = parseInt(gorgeName?.split("-")[1]!)

        let finalPosition: IPosition = {
            x: gorge.position.x - gameComponent.width / 2,
            y: gorge.position.y - gameComponent.height / 2
        };

        if (gorgeName && canBeOccupied(gorge.getId(), id)) {
            gorge.removeAllGameComponents();
            this.occupationMap[gorge.getId()] = Occupation.Empty;
            
            gorge = this.gameplayElementsManager.getSingleElementByNameAndType(gorgeName, 'gorge') as Gorge;
            this.occupationMap[gorge.getId()] = this.playerManager.playerOnTurnId();
            
            gorge.addNewGameComponent(gameComponent);
            
            finalPosition = {
                x: gorge.position.x - gameComponent.width / 2,
                y: gorge.position.y - gameComponent.height / 2
            }

            isTurnEnded = true;
        }
        
        await gameComponent.move(finalPosition);

        if (isTurnEnded && this.isMill(gorge.getId(), this.playerManager.playerOnTurnId())) {
            isTurnEnded = false;
        } 

        return isTurnEnded;
    }

    private finishPlayerTurn() {
        const currnetPlayer = this.playerManager.playerOnTurnId();
        const nextPlayer = this.playerManager.nextPlaterId();

        if (this.playerGameComponents[currnetPlayer].length === 0 && this.gamePhase[currnetPlayer] === GamePhases.Placing) {
            this.gamePhase[currnetPlayer] = GamePhases.Moving;
            this.app.emitter.emit(GameEvents.NEW_MESSAGE, 'It is moving pieces phase', 2000);
        }

        if (Object.values(this.occupationMap).filter(o => o === nextPlayer).length === 3 && this.gamePhase[nextPlayer] === GamePhases.Moving) {
            this.gamePhase[nextPlayer] = GamePhases.Flying;
            this.app.emitter.emit(GameEvents.NEW_MESSAGE, `It is flying pieces phase for ${nextPlayer}`, 2000);
        }

        if (Object.values(this.occupationMap).filter(o => o === nextPlayer).length < 3 && (this.gamePhase[currnetPlayer] === GamePhases.Flying || this.gamePhase[nextPlayer] === GamePhases.Flying)) {
            this.app.emitter.emit(GameEvents.NEW_MESSAGE, `${currnetPlayer} is a winner!!!`, 2000);
            this.app.emitter.emit(GameEvents.GAME_END);
            return;
        }

        console.log("Empty: ", Object.values(this.occupationMap).filter(o => o === Occupation.Empty).length);

        this.changePlayerTurn(); 
    }

    private isGameComponentCaptured(gorgeName: string, gameComponentName: string) {
        const gameComponent: GameComponent = this.gameplayElementsManager.getSingleElementByNameAndType(gameComponentName, "gameComponent") as GameComponent;
        const gorge: Gorge = this.gameplayElementsManager.getSingleElementByNameAndType(gorgeName, "gorge") as Gorge;

        if (!gorge.getElementsCount()) {
            gorge.addNewGameComponent(gameComponent);
        }
        
        if (!gorge || this.occupationMap[gorge.getId()] === this.playerManager.playerOnTurnId()) return false;

        if (this.isMill(gorge.getId(), this.playerManager.nextPlaterId())) return false;

        gorge.removeAllGameComponents();
        this.occupationMap[gorge.getId()] = Occupation.Empty;

        gameComponent.move({x: 0, y: 0}, () => {gameComponent.visible = false});
        
        return true;
    }

    private isMill(gorgeId: number, player: number) {
        const mills = rawMap.filter(mill => mill.includes(gorgeId));

        let result = false;

        mills.forEach(mill => {
            let isMill = true;

            mill.forEach(m => {
                if (this.occupationMap[m] != player) {
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

    private testCollision(point: PIXI.Point): string | undefined {
        let result!: string;
        Object.entries(this.gorgeDimensionMap).forEach(gorgeDimension => {
            if (this.isCollision(point, gorgeDimension[1])) {
                result = gorgeDimension[0];
            }
        })

        return result;
    }

    private isCollision(point: PIXI.Point, dimension: IDimension) {        
        if ((dimension.x - dimension.width / 2) < point.x 
            && point.x < (dimension.x + dimension.width / 2) 
            && (dimension.y - dimension.width / 2) < point.y 
            && point.y < (dimension.y + dimension.width / 2))
                return true;

        return false;
    }

    private changePlayerTurn(): void {
        this.playerManager.turnEnd();
        this.showCurrentPlayer();
    }

    private showCurrentPlayer() {
        this.app.emitter.emit(GameEvents.PLAYER_CHANGE, this.playerManager.playerOnTurnId());
    }
}