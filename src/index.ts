import { Gameplay } from "./games/mancala/Gameplay";
import { Boot } from "./boot/Boot";
import { Application } from "./Application";
import './index.css';

import gameConfig from './games/mancala/GameConfig.json';

type IGameConfig = typeof gameConfig;
const gameplay = new Gameplay();

new Boot();