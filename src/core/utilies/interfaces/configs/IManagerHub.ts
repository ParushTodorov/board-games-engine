import { AssetManager } from "../../../assets/AssetManager";
import { BaseGameplay } from "../../../managers/Gameplay";
import { MessageManager } from "../../../managers/MessageManager";
import { PlayerManager } from "../../../playerManager/PlayerManager";
import { MainView } from "../../../managers/MainView";

export interface IManagerHub {
    gameplay: BaseGameplay;
    mainView: MainView;
    assetManager: AssetManager;
    messageManager: MessageManager;
    playerManager: PlayerManager
}