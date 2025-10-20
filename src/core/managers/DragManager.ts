import * as PIXI from "pixi.js";

import { GameComponent } from "../utilies/viewElements/GameComponent";
import { IDimension } from "../utilies/interfaces/common/IDimension";
import { isCollision } from "../utilies/functions/testForCollision";
import { GameplayElementsManager } from "./GameplayElementsManager";
import { Application } from "../../Application";
import { Gorge } from "../utilies/viewElements/Gorge";
import { IPosition } from "../utilies/interfaces/common/IPosition";
import { PlayerManager } from "./PlayerManager";
import { Occupation } from "../utilies/enums/Occupation";
import { GameEvents } from "../utilies/GameEvents";

export class DragManager {

    public canBeOccupied: (startId: number, endId: number) => boolean = (startId: number, endId: number) => true;

    protected app: Application;
    protected gameplayElementsManager: GameplayElementsManager;
    protected playerManager: PlayerManager;

    protected occupationMap: {[key: number]: Occupation} = {};
    protected gorgeDimensionMap: {[key: string]: IDimension} = {};
    protected activListener: {[key: string]: boolean} = {};

    public init() {
        this.app = Application.APP;
        this.gameplayElementsManager = this.app.gameplayManager;
        this.playerManager = this.app.playerManager;
        this.creategorgeDimensionMap();
    }

    public startDragging(gameComponent: GameComponent) {
        gameComponent.startDragging();

        if (this.activListener[gameComponent.getName()]) return;

        const addListnerFunc = (e: PointerEvent) => {
            if (!gameComponent.isDragging()) return;

            gameComponent.moveFromGlobalPosition(new PIXI.Point(e.x, e.y));
        }

        window.addEventListener('pointermove', addListnerFunc);

        this.activListener[gameComponent.getName()] = true;
    }

    public async stopDragging(gameComponent: GameComponent) {
        let isTurnEnded = false;
        let gorge: Gorge = gameComponent.getGorgeOwner() as Gorge;
        let { x, y } = gameComponent;

        gameComponent.stopDragging();
        x += gameComponent.width / 2;
        y += gameComponent.height / 2;

        const gorgeName: string | undefined = this.testCollision(new PIXI.Point(x, y));
        const id = parseInt(gorgeName?.split("-")[1]!)

        let finalPosition: IPosition = this.calculateFinalPostion(gorge, gameComponent);

        if (gorgeName && this.canBeOccupied && this.canBeOccupied(gorge.getId(), id)) {
            gorge.removeAllGameComponents();
            this.setOccupation(gorge.getId(), Occupation.Empty);
            
            gorge = this.gameplayElementsManager.getSingleElementByNameAndType(gorgeName, 'gorge') as Gorge;
            this.setOccupation(gorge.getId(), this.playerManager.playerOnTurnId());
            
            gorge.addNewGameComponent(gameComponent);
            
            finalPosition = this.calculateFinalPostion(gorge, gameComponent);

            isTurnEnded = true;
        }
        
        await gameComponent.move(finalPosition);
        this.app.emitter.emit(GameEvents.PLAY_SOUND, "movingSound");

        return isTurnEnded;
    }

    public setOccupation(id: number, occupation: Occupation) {
        this.occupationMap[id] = occupation;
    }

    public getOccupation(id: number): Occupation {
        return this.occupationMap[id];
    }

    public getOccupationMap() {
        return this.occupationMap;
    }

    protected calculateFinalPostion(gorge: Gorge, gameComponent: GameComponent): IPosition {
        return {
                x: gorge.position.x - gameComponent.width / 2,
                y: gorge.position.y - gameComponent.height / 2
            }
    }

    protected testCollision(point: PIXI.Point) {
        let result!: string;
        Object.entries(this.gorgeDimensionMap).forEach(gorgeDimension => {
            if (isCollision(point, gorgeDimension[1])) {
                result = gorgeDimension[0];
            }
        })

        return result;
    }

    protected creategorgeDimensionMap() {
        this.gorgeDimensionMap = {};
        const gorge = this.gameplayElementsManager.getAllElementsByType('gorge') as Gorge[];

        gorge.forEach(g => {
            this.gorgeDimensionMap[g.getName()] = {
                x: g.x,
                y: g.y,
                width: g.width,
                height: g.height
            } 
        })
    }
}