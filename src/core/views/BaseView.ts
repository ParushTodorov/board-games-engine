import { Application } from "../../Application";
import { IDimension } from "../utilies/interfaces/common/IDimension";
import { IMainViewElements } from "../utilies/interfaces/common/IMainViewElements";
import { BaseMainViewElements } from "../utilies/viewElements/BaseMainViewElement";

export class BaseView extends BaseMainViewElements implements IMainViewElements {
    public onResize(): void {       
    }
}