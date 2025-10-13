
import { IGameBoardConfig } from "../utilies/interfaces/configs/gameConfig/IGameBoardConfig";
import { IGameViewElementsConfig } from "../utilies/interfaces/configs/gameConfig/IGameViewElementsConfig";
import { IGorgeConfig } from "../utilies/interfaces/configs/gameConfig/IGorgeConfig";
import { IElementConfig } from "../utilies/interfaces/elementConfigs/IElementConfig";
import { IGorgeElementConfig } from "../utilies/interfaces/elementConfigs/IGorgeElementConfig";
import { GameElementType } from "../utilies/types/GameElementTypes";
import { BaseView } from "./BaseView";
import { GameBoard } from "../utilies/viewElements/GameBoard";
import { GameComponent } from "../utilies/viewElements/GameComponent";
import { Gorge } from "../utilies/viewElements/Gorge";
import { Application } from "../../Application";
import { Background } from "../utilies/viewElements/Background";

export class GameplayView extends BaseView {

    private gameplayViewConfig: IGameViewElementsConfig;
    
    private background: Background;
    private gameBoards: Map<string, GameBoard> = new Map();
    private gorges: Map<string, Gorge> = new Map();
    private gameComponents: Map<string, GameComponent> = new Map();

    private currentBoardName: string;

    constructor(gameplayViewConfig: IGameViewElementsConfig) {
        super();

        this.gameplayViewConfig = gameplayViewConfig;
        this.pivot.set(gameplayViewConfig.pivot.x, gameplayViewConfig.pivot.y);
    }

    public init() {
        this.createBackground();
        this.createGameBoard();
        this.createGorges();
        this.createGameComponents();
        this.onResize();
    }

    public onResize() {
        const { width, height } = this.app.viewSizes;
        
        this.x = width / 2;
        this.y = height / 2;

        const scale = Math.min(width / this.gameplayViewConfig.alwaysOnViewBounds.width, height / this.gameplayViewConfig.alwaysOnViewBounds.height);

        this.scale.set(scale);

        const backgroundScaleX = (width / scale) / (this.background.width/ this.background.scale.x);
        const backgroundScaleY =  (height / scale) / (this.background.height / this.background.scale.y);
        const backgroundScale = Math.max(backgroundScaleX, backgroundScaleY, 1 );
        this.background.scale.set(backgroundScale);

        this.background.x = this.gameplayViewConfig.pivot.x - this.background.width / 2;
        this.background.y = this.gameplayViewConfig.pivot.y - this.background.height / 2;
    }

    private createBackground() {
        const backgroundConfig = this.gameplayViewConfig.background;
        this.background = new Background(backgroundConfig);

        // this.background.anchor = {x: 0.5, y: 0.5};
        this.addChild(this.background);
    }

    private createGameBoard() {
        this.currentBoardName = this.gameplayViewConfig.gameBoard.startBoardName;

        Object.keys(this.gameplayViewConfig.gameBoard.boards).forEach(
            value => {
                const config: IGameBoardConfig = this.gameplayViewConfig.gameBoard.boards[value];
                const gameBoard: GameBoard = new GameBoard(config);
                gameBoard.x = config.globalPositions.x;
                gameBoard.y = config.globalPositions.y;

                this.app.gameplayManager.setElement('board', config.assetName, gameBoard);

                if (this.currentBoardName === value) {
                    this.addChild(gameBoard);
                }
            }
        )
    }

    private createGorges() {
        const currentGameBoard = this.app.gameplayManager.getSingleElementByNameAndType(this.currentBoardName, 'board');

        Object.keys(this.gameplayViewConfig.gorge).forEach(
            value => {
                const config: IGorgeConfig = this.gameplayViewConfig.gorge[value];
                for (let i = 0; i < config.count; i++) {
                    const gorgeConfig: IGorgeElementConfig = {
                        type: "gorge",
                        assetName: config.assetName!,
                        name: value,
                        id: i,
                        size: config.size,
                        gameComponentsPosition: config.gameComponentsPosition,
                    }

                    const gorge = new Gorge(gorgeConfig);
                    
                    gorge.x = currentGameBoard.x + config.globalPositions[i].x;
                    gorge.y = currentGameBoard.y + config.globalPositions[i].y;

                    this.addChild(gorge);
                    this.app.gameplayManager.setElement('gorge', gorge.getName(), gorge);
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
                        type: "gameComponent",
                        name: value,
                        assetName: config.assetName!,
                        id: i,
                        size: config.size,
                    }

                    const gameComponent = new GameComponent(gameComponentConfig);
                    
                    if (config.globalPositions) {
                        gameComponent.x = config.globalPositions[i].x;
                        gameComponent.y = config.globalPositions[i].y;
                    }

                    this.addChild(gameComponent);
                    this.app.gameplayManager.setElement('gameComponent', gameComponent.getName(), gameComponent);
                }
            }
        )
    }
}