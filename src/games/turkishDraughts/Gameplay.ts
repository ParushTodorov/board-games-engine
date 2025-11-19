import { FederatedPointerEvent } from "pixi.js";
import { BaseGameplay } from "../../core/managers/Gameplay";
import { Occupation } from "../../core/utilies/enums/Occupation";
import { GameEvents } from "../../core/utilies/GameEvents";
import { Player } from "../../core/utilies/playerManager/Player";
import { GameComponent } from "../../core/utilies/viewElements/GameComponent";
import { Gorge } from "../../core/utilies/viewElements/Gorge";
import { nextGorgesPlayerOne, nextGorgesPlayerTwo } from "./utilis/BoardRules";
import { GameComponentZIndex } from "./utilis/ZIndexMap";
import { CustomGameComponent } from "./customViews/CustomGorgeComponent";

export class Gameplay extends BaseGameplay {
    private playerGameComponents: {[key: number]: GameComponent[]} = {
        1: [],
        2: []
    }

    private playerIdToNameMap: {[key: number]: string} = {
        1: "playerOne",
        2: "playerTwo"
    }

    private playerIdToKingPromoGorges: {[key: number]: number[]} = {
        1: [0, 1, 2, 3, 4, 5, 6, 7],
        2: [63, 62, 61, 60, 59, 58, 57, 56]
    }

    private currentGameComponentName?: string;

    public init(): void {
        super.init();

        this.app.emitter.on(GameEvents.GAME_COMPONENT_UP, () => {}, this);
        this.app.emitter.on(GameEvents.GAME_COMPONENT_DOWN, this.onDragStart, this);
        this.app.emitter.on(GameEvents.GAME_COMPONENT_UP, this.onDragEnd, this);

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

        if (gameComponents.length != 32) {
            console.warn("There must be 32 game components for this games");
            return;
        }

        if (gorges.length != 64) {
            console.warn("There must be 64 game components for this games");
            return;
        }

        gameComponents.forEach(gameComponent => {
            gameComponent.visible = true;
            gameComponent.interactive = true;
            gameComponent.zIndex = GameComponentZIndex.NotActive;

            if (gameComponent.getName().includes('playerOne')) {
                this.playerGameComponents[1].push(gameComponent);
                return;
            }

            this.playerGameComponents[2].push(gameComponent);
        });

        const addElementToGorge = (player: number, gorge: Gorge) => {
            const gameComponent = this.playerGameComponents[player].pop();
                
            if (!gameComponent) return;

            const {x, y, width, height} = gorge;

            gameComponent.x = x - gameComponent.width / 2;
            gameComponent.y = y - gameComponent.height / 2;

            gorge.addNewGameComponent(gameComponent);

            this.dragManager.setOccupation(gorge.getId(), player);
        }

        gorges.forEach((gorge, index) => {
            gorge.removeAllGameComponents();
            this.dragManager.setOccupation(index, Occupation.Empty);

            if (gorge.getId() > 7 && gorge.getId() < 24) {
                addElementToGorge(2, gorge);
            }

            if (gorge.getId() > 39 && gorge.getId() < 58) {
                addElementToGorge(1, gorge);
            }
        });


        this.playerManager.startGame();
        this.showCurrentPlayer();

        super.onStartNewGame();

        this.app.emitter.emit(GameEvents.PLAY_LOOP, "mainMusic", 0.5);
    }

    protected async onDragStart(event: FederatedPointerEvent, startElement: string, element: string) {
        // MAX DAMAGE LOGIC

        if (this.currentGameComponentName && this.currentGameComponentName != element) return;

        const gameComponent: GameComponent = this.gameplayElementsManager.getSingleElementByNameAndType(element, "gameComponent") as GameComponent;
        gameComponent.zIndex = GameComponentZIndex.Active;

        if (!this.isGameCompomemtOwnedByCurrentPlayerTurn(gameComponent)) return;

        this.dragManager.startDragging(gameComponent);
    }

    protected async onDragEnd(event: FederatedPointerEvent, startElement: string, element: string)  {
        const gameComponent: CustomGameComponent = this.gameplayElementsManager.getSingleElementByNameAndType(element, 'gameComponent') as CustomGameComponent;
        let isCaptured: boolean = false;
        let capturedGorgeId: number = -1;

        const canBeOccupied: (startId: number, endId: number) => boolean = (startId, endId) => {           
            if (this.dragManager.getOccupation(endId) != Occupation.Empty) return false;
            
            const changeDirection = endId - startId;

            if (Math.abs(changeDirection) === 1 || Math.abs(changeDirection) === 8) {
                const nextGorge = this.playerManager.playerOnTurnId() === 1 ? 
                nextGorgesPlayerOne(startId, 1) : nextGorgesPlayerTwo(startId, 1);
                
                if (nextGorge.includes(endId))
                    return true;
            }

            const capturedGorgeIds: number[] = [];
            this.getAllGorgesForCurrentDirection(startId, endId, capturedGorgeIds);

            if (capturedGorgeIds.length != 1 && !gameComponent.isKing()) return false;
            capturedGorgeId = capturedGorgeIds.shift()!;
            console.log(capturedGorgeIds);

            const nextGorge = nextGorgesPlayerTwo(startId, capturedGorgeIds.length + 2, true);
            
            if (nextGorge.includes(endId) && this.dragManager.getOccupation(capturedGorgeId) === this.playerManager.nextPlayerId()) {
                isCaptured = true;
            }

            if (gameComponent.isKing() && capturedGorgeIds.filter(c => this.dragManager.getOccupation(c) != Occupation.Empty).length != 0) return false;
            
            return true;
        }

        this.dragManager.canBeOccupied = canBeOccupied;

        if (!await this.dragManager.stopDragging(gameComponent)) return;

        const gorgeOwnerId = gameComponent.getGorgeOwner()?.getId()!

        if (isCaptured) {
            this.currentGameComponentName = gameComponent.getName();

            await this.captureGameComponent(capturedGorgeId);

            if (this.isCapurePosible(gorgeOwnerId, gameComponent.isKing())) return;
        };

        gameComponent.zIndex = GameComponentZIndex.NotActive;
        this.currentGameComponentName = undefined;

        if (this.isKingPromotion(gorgeOwnerId)) {
            gameComponent.activateCrown();
        }

        this.finishPlayerTurn();
    }

    private async captureGameComponent(capturedGorgeId: number) {
            const gorge = (this.gameplayElementsManager.getAllElementsByType("gorge") as Gorge[]).filter(g => g.getId() === capturedGorgeId);
            
            if (gorge.length != 1) console.error("Somthing goes very wrong!!!");

            const capturedGameComponent = gorge[0].getAllCurrentGameComponents()[0];

            if (!capturedGameComponent) console.error("Somthing goes very very wrong!!!");

            gorge[0].removeAllGameComponents();
            this.dragManager.setOccupation(capturedGorgeId, Occupation.Empty);

            await capturedGameComponent.move({x: 0, y: 0}, () => {capturedGameComponent.visible = false});
    }

    private isCapurePosible(gorgeOwnerId: number, isKing: boolean): boolean {
        if (!isKing) {
            return this.isCapurePosibleNextToGameComponent(gorgeOwnerId);
        }
        
        let index = 1;

        while (index <= 8) {
            if (this.isCapurePosibleNextToGameComponent(gorgeOwnerId, index, true)) return true;

            index++;
        }

        return false;
    }

    private isCapurePosibleNextToGameComponent(ownerId: number, index: number = 1, isKing: boolean = false) {
        const nextGorges = nextGorgesPlayerOne(ownerId, index, true);
        const twoStepsNextGorges = nextGorgesPlayerOne(ownerId, index + 1, true);
        let isCapurePosible: boolean = false;
        
        console.log("ownerId: ", ownerId, " all: ", JSON.stringify(nextGorges));

        nextGorges.forEach(gorgeId => {
            const isNextEnemy = this.dragManager.getOccupation(gorgeId) === this.playerManager.nextPlayerId();
            const afterParty = ownerId - 2 * (ownerId - gorgeId);

            if (0 < afterParty  && afterParty > 63 || !twoStepsNextGorges.includes(afterParty)) return;

            const isAfterPartyOpen = this.dragManager.getOccupation(afterParty) === Occupation.Empty;

            if (isNextEnemy && isAfterPartyOpen) {
                console.log("ownerId: ", ownerId , " gorgeId: ", gorgeId, ", afterParty: ", afterParty, ", isNextEnemy: ", isNextEnemy, ", isAfterPartyOpen: ", isAfterPartyOpen);
                isCapurePosible = true;
            }
        })

        return isCapurePosible;
    }

    private isGameCompomemtOwnedByCurrentPlayerTurn(gameComponent: GameComponent) {
        const currentPlayerName = this.playerIdToNameMap[this.playerManager.playerOnTurnId()];

        return gameComponent.getName().includes(currentPlayerName);
    }

    private isKingPromotion(gorgeId: number) {
        return this.playerIdToKingPromoGorges[this.playerManager.playerOnTurnId()].includes(gorgeId);
    }

    private finishPlayerTurn() {
        this.changePlayerTurn(); 
    }

    private showCurrentPlayer() {
        this.app.emitter.emit(GameEvents.PLAYER_CHANGE, this.playerManager.playerOnTurnId());
    }
    
    private changePlayerTurn(): void {
        this.playerManager.turnEnd();
        this.showCurrentPlayer();
    }
    private getAllGorgesForCurrentDirection(startId: number, endId: number, gorgeIds: number[]) {        
        const changeDirection = endId - startId;
    
        let coefDelta: number
        if (Math.abs(changeDirection) < 7) {
            coefDelta = changeDirection < 0 ? changeDirection + 1 : changeDirection - 1;
        } else {
            coefDelta = changeDirection < 0 ? changeDirection + 8 : changeDirection - 8;
        }

        if (coefDelta === 0) return;

        const capturedGorgeId = startId + coefDelta;

        gorgeIds.push(capturedGorgeId);

        this.getAllGorgesForCurrentDirection(startId, capturedGorgeId, gorgeIds);
    }
}