import { Application } from "../Application";
import { Games } from "./Games";
import { IManagerHub } from "../core/utilies/interfaces/configs/IManagerHub";
export class Boot {
    public params: {[key: string]: string} = {};

    constructor() {
        console.log(window.location.search)
        this.setParams();
        console.log(this.params);

        this.getGame();
    }

    private setParams() {
        
        const params = window.location.search.replace("?", "").split("&");

        params.forEach(param => {
            const paramData = param.split("=");
            this.params[paramData[0]] = paramData[1];
        });
    }

    private async getGame() {
        const gameName = Games[this.params['game']];

        const gameConfig = await import(`../games/${gameName}/GameConfig.json`);
        type IGameConfig = typeof gameConfig;

        const { ManagerHub } = await import(`../games/${gameName}/ManagerHub.ts`)
        const managerHub: IManagerHub = new ManagerHub();

        const app = new Application(managerHub, gameConfig);
        await app.init();
    }
}