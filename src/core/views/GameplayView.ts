
import { IGameBoardConfig } from "../utilies/interfaces/configs/gameConfig/IGameBoardConfig";
import { IGameViewElementsConfig } from "../utilies/interfaces/configs/gameConfig/IGameViewElementsConfig";
import { IGorgeConfig } from "../utilies/interfaces/configs/gameConfig/IGorgeConfig";
import { IElementConfig } from "../utilies/interfaces/elementConfigs/IElementConfig";
import { IGorgeElementConfig } from "../utilies/interfaces/elementConfigs/IGorgeElementConfig";
import { BaseView } from "./BaseView";
import { GameBoard } from "../utilies/viewElements/GameBoard";
import { GameComponent } from "../utilies/viewElements/GameComponent";
import { Gorge } from "../utilies/viewElements/Gorge";
import { GameLogo } from "../utilies/viewElements/GameLogo";
import { Background } from "../utilies/viewElements/Background";

export class GameplayView extends BaseView {

    protected gameplayViewConfig: IGameViewElementsConfig;
    
    protected background: Background;
    protected gameLogo: GameLogo;

    protected currentBoardName: string;

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
        this.createGameLogo();
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

    protected createBackground() {
        const backgroundConfig = this.gameplayViewConfig.background;
        this.background = new Background(backgroundConfig);

        this.addChild(this.background);
    }

    protected createGameLogo() {
        const gameLogoConfig = this.gameplayViewConfig.gameLogo;

        this.gameLogo = new GameLogo(gameLogoConfig);

        this.gameLogo.x = gameLogoConfig.globalPositions.x - this.gameLogo.width / 2;
        this.gameLogo.y = gameLogoConfig.globalPositions.y;

        this.addChild(this.gameLogo);
    }

    
    protected createGameBoard() {
        this.currentBoardName = this.gameplayViewConfig.gameBoard.startBoardName;

        Object.keys(this.gameplayViewConfig.gameBoard.boards).forEach(
            value => {
                const config: IGameBoardConfig = this.gameplayViewConfig.gameBoard.boards[value];
                const gameBoard: GameBoard = new GameBoard(config);
                gameBoard.x = config.globalPositions.x;
                gameBoard.y = config.globalPositions.y;

                this.app.gameplayManager.setElement('board', config.assetName, gameBoard);

                if (this.currentBoardName === value) {
                    this.app.gameplayManager.setCurrentBoard(gameBoard);
                    this.addChild(gameBoard);
                }
            }
        )
    }

    protected createGorges() {
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

    protected createGameComponents() {
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