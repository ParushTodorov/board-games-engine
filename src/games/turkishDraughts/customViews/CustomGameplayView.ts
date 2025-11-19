import { IGorgeConfig } from "../../../core/utilies/interfaces/configs/gameConfig/IGorgeConfig";
import { IElementConfig } from "../../../core/utilies/interfaces/elementConfigs/IElementConfig";
import { IGorgeElementConfig } from "../../../core/utilies/interfaces/elementConfigs/IGorgeElementConfig";
import { GameBoard } from "../../../core/utilies/viewElements/GameBoard";
import { Gorge } from "../../../core/utilies/viewElements/Gorge";
import { GameplayView } from "../../../core/views/GameplayView";
import { CustomGameComponent } from "./CustomGorgeComponent";

export class CustomGameplayView extends GameplayView {
    protected createGorges() {
        const currentGameBoard: GameBoard = this.app.gameplayManager.getSingleElementByNameAndType(this.currentBoardName, 'board') as GameBoard;

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
                    
                    gorge.x = currentGameBoard.x + config.globalPositions[0].x + i % 8 * config.size.w + config.size.w / 2;
                    gorge.y = currentGameBoard.y + config.globalPositions[0].y + Math.floor(i / 8) * config.size.h + config.size.h / 2;

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

                    const gameComponent = new CustomGameComponent(gameComponentConfig);
                    
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