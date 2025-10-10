import { IGameBoardConfig } from "../../core/utilies/interfaces/configs/IGameBoardConfig";
import { IGameViewElementsConfig } from "../../core/utilies/interfaces/configs/IGameViewElementsConfig";
import { IGorgeConfig } from "../../core/utilies/interfaces/configs/IGorgeConfig";
import { IElementConfig } from "../../core/utilies/interfaces/elementConfigs.ts/IElementConfig";
import { IGorgeElementConfig } from "../../core/utilies/interfaces/elementConfigs.ts/IGorgeElementConfig";
import { BaseMainViewElements } from "../../core/utilies/viewElements/BaseMainViewElement";
import { GameBoard } from "../../core/utilies/viewElements/GameBoard";
import { GameComponent } from "../../core/utilies/viewElements/GameComponent";
import { Gorge } from "../../core/utilies/viewElements/Gorge";

export class MancalaGameplayView extends BaseMainViewElements {

    private gameplayViewConfig: IGameViewElementsConfig;

    private gameBoards: Map<string, GameBoard> = new Map();
    private gorges: Map<string, Gorge> = new Map();
    private gameComponents: Map<string, GameComponent> = new Map();

    constructor(gameplayViewConfig: IGameViewElementsConfig) {
        super();

        this.gameplayViewConfig = gameplayViewConfig;
    }

    public init() {
        super.interactive
        this.createGameBoard();
        this.createGorges();
        this.createGameComponents();
    }

    private createGameBoard() {
        Object.keys(this.gameplayViewConfig.gameBoard).forEach(
            value => {
                const config: IGameBoardConfig = this.gameplayViewConfig.gameBoard.boards[value];
                const gameBoard: GameBoard = new GameBoard(config);
                gameBoard.x = config.position.x;
                gameBoard.y = config.position.y;

                this.addChild(gameBoard);
                this.gameBoards.set(config.assetName, gameBoard);
            }
        )
    }

    private createGorges() {
        Object.keys(this.gameplayViewConfig.gorge).forEach(
            value => {
                const config: IGorgeConfig = this.gameplayViewConfig.gorge[value];
                for (let i = 0; i < config.count; i++) {
                    const gorgeConfig: IGorgeElementConfig = {
                        name: value,
                        type: "gorge",
                        id: i,
                        size: config.size,
                        gameComponentsPosition: config.gameComponentsPosition,
                    }

                    const gorge = new Gorge(gorgeConfig);
                    
                    gorge.x = config.globalPositions[i].x;
                    gorge.y = config.globalPositions[i].y;

                    this.addChild(gorge);
                    this.gorges.set(gorge.getName(), gorge);
                }
            }
        )
    }

    private createGameComponents() {
        Object.keys(this.gameplayViewConfig.gameComponents).forEach(
            value => {
                const config = this.gameplayViewConfig.gameComponents[value];

                for (let i = 0; i < config.count; i++) {
                    const gameComponentConfig: IElementConfig = {
                        name: value,
                        type: "gameComponent",
                        id: i,
                        size: config.size,
                    }

                    const gameComponent = new GameComponent(gameComponentConfig);
                    
                    if (config.globalPositions) {
                        gameComponent.x = config.globalPositions[i].x;
                        gameComponent.y = config.globalPositions[i].y;
                    }

                    this.addChild(gameComponent);
                    this.gameComponents.set(gameComponent.getName(), gameComponent);
                }
            }
        )
    }
}