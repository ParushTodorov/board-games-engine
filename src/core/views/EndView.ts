import { IBackgroundConfig } from "../utilies/interfaces/configs/gameConfig/IBackgroundConfig";
import { IViewConfig } from "../utilies/interfaces/configs/gameConfig/IViewConfig";
import { IBaseElementConfig } from "../utilies/interfaces/configs/IBaseElementConfig";
import { Background } from "../utilies/viewElements/Background";
import { BaseView } from "./BaseView";

export class EndView extends BaseView {

    private config: IViewConfig
    private background: Background;

    constructor(config: IViewConfig) {
        super();

        this.config = config;
        this.createBackground();
        this.pivot.set(this.config.pivot.x,this.config.pivot.y);
    }
    
    private createBackground() {
        if (!this.config) return;
        
        const backgroundConfig = this.config.elements["background"];

        if (!backgroundConfig) {
            return;
        }

        const config: IBackgroundConfig = {
            assetName: backgroundConfig.assetName,
            globalPositions: backgroundConfig.globalPositions,
            size: backgroundConfig.size!,
            anchor: backgroundConfig.anchor
        }

        this.background = new Background(config);        
        this.addChild(this.background);
    }

    public onResize() {
        const { width, height } = this.app.viewSizes;
        
        this.x = width / 2;
        this.y = height / 2;

        const scale = Math.max(width / this.config.alwaysOnViewBounds.width, height / this.config.alwaysOnViewBounds.height);

        this.scale.set(scale);
    }
}