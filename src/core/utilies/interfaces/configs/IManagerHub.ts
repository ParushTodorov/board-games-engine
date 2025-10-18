import { AssetManager } from "../../../managers/AssetManager";
import { BaseGameplay } from "../../../managers/Gameplay";
import { MessageManager } from "../../../managers/MessageManager";
import { PlayerManager } from "../../../managers/PlayerManager";
import { MainView } from "../../../managers/MainView";
import { GameplayElementsManager } from "../../../managers/GameplayElementsManager";
import { AudioManager }  from "../../../managers/AudioManager";

export interface IManagerHub {
    gameplay: BaseGameplay;
    mainView: MainView;
    assetManager: AssetManager;
    messageManager: MessageManager;
    playerManager: PlayerManager;
    gameplayElementsManager: GameplayElementsManager;
    audioManager: AudioManager;
}