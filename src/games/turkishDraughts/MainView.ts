import { BaseMainView } from "../../core/managers/MainView";
import { CustomGameplayView } from "./customViews/CustomGameplayView";

export class MainView extends BaseMainView {
     protected createGamePlayView() {
         if (this.views.has("gameplayView")) return;
         
         const gameplayView = new CustomGameplayView(this.viewConfig.gameViewElements);
         gameplayView.init();
         gameplayView.visible = false;
         gameplayView.alpha = 0;
         this.views.set("gameplayView", gameplayView);
         this.addChild(gameplayView);
     }
    
}