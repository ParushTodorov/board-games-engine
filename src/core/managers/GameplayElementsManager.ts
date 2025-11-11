import { GameElementType } from "../utilies/types/GameElementTypes";
import { Background } from "../utilies/viewElements/Background";
import { GameBoard } from "../utilies/viewElements/GameBoard";
import { GameComponent } from "../utilies/viewElements/GameComponent";
import { Gorge } from "../utilies/viewElements/Gorge";


export class GameplayElementsManager {
    private gameBoards: Map<string, GameBoard> = new Map();
    private gorges: Map<string, Gorge> = new Map();
    private gameComponents: Map<string, GameComponent> = new Map();

    private currentBoard: GameBoard;

    public setElement(type: GameElementType, name: string, element: any) {
        switch (type) {
            case "board":
                this.gameBoards.set(name, element);
                break;
            case "gameComponent":
                this.gameComponents.set(name, element);
                break;
            case "gorge":
                this.gorges.set(name, element);
                break;
            default:
                break;
        }
    }
    
    public getSingleElementByNameAndType(name: string, type: GameElementType) {
        switch (type) {
            case "board":
                return this.getElement(name, type, this.gameBoards);
            case "gameComponent":
                return this.getElement(name, type, this.gameComponents);
            case "gorge":
                return this.getElement(name, type, this.gorges);
            default:
                break;
        }
    }

    public getAllElementsByType(type: GameElementType) {
        switch (type) {
            case "board":
                return this.getAllElements(this.gameBoards);
            case "gameComponent":
                return this.getAllElements(this.gameComponents);
            case "gorge":
                return this.getAllElements(this.gorges);
            default:
                break;
        }
    }

    public setCurrentBoard(gameBoard: GameBoard) {
        this.currentBoard = gameBoard;
    }

    public getCurrentBoard() {
        return this.currentBoard;
    }

    private getElement<T>(name: string, type: GameElementType, map: Map<string, T>) {
        if (!map.has(name)) {
            console.warn(`No ${type} with name ${name}!!!`);
            return undefined;   
        }

        return map.get(name);
    }

    private getAllElements<T>(map: Map<string, T>) {
        return [...map.values()];
    }
}