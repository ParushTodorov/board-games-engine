import { AssetManager } from "./managers/AssetManager";
import { BaseGameplay } from "./managers/Gameplay";
import { GameplayElementsManager } from "./managers/GameplayElementsManager";
import { MainView } from "./managers/MainView";
import { MessageManager } from "./managers/MessageManager";
import { PlayerManager } from "./managers/PlayerManager";
import { IManagerHub } from "./utilies/interfaces/configs/IManagerHub";

export class BaseManagerHub implements IManagerHub {
    public gameplay: BaseGameplay;
    public mainView: MainView;
    public assetManager: AssetManager;
    public messageManager: MessageManager;
    public playerManager: PlayerManager;
    public gameplayElementsManager: GameplayElementsManager;

    constructor() {
        this.mainView = new MainView();
        this.gameplay = new BaseGameplay();
        this.assetManager = new AssetManager();
        this.messageManager = new MessageManager();
        this.playerManager = new PlayerManager();
        this.gameplayElementsManager = new GameplayElementsManager();
    }

}