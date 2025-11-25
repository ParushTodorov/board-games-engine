import { Application } from "../../Application";
import { ManagerHub } from "./ManagerHub";
import gameConfig from "./GameConfig.json";
import { IManagerHub } from "../../core/utilies/interfaces/configs/IManagerHub";

// type IGameConfig = typeof gameConfig;
const managerHub: IManagerHub = new ManagerHub();

const app = new Application(managerHub, gameConfig);
app.init();