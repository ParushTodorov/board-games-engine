import { Application } from "../Application";
import { Games } from "./Games";

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

        const { Gameplay } = await import(`../games/${gameName}/Gameplay.ts`)

        const gameConfig = await import(`../games/${gameName}/GameConfig.json`);
        type IGameConfig = typeof gameConfig;

        const app = new Application(new Gameplay(), gameConfig);
        await app.init();
    }
}