import { AssetManager } from "../../../managers/AssetManager";
import { BaseGameplay } from "../../../managers/Gameplay";
import { MessageManager } from "../../../managers/MessageManager";
import { PlayerManager } from "../../../managers/PlayerManager";
import { BaseMainView } from "../../../managers/MainView";
import { GameplayElementsManager } from "../../../managers/GameplayElementsManager";
import { AudioManager }  from "../../../managers/AudioManager";
import { DragManager } from "../../../managers/DragManager";

export interface IManagerHub {
    gameplay: BaseGameplay;
    mainView: BaseMainView;
    assetManager: AssetManager;
    messageManager: MessageManager;
    playerManager: PlayerManager;
    gameplayElementsManager: GameplayElementsManager;
    audioManager: AudioManager;
    dragManager: DragManager;
}