import { IMainViewElements } from "../utilies/interfaces/common/IMainViewElements";
import { BaseMainViewElement } from "../utilies/viewElements/BaseMainViewElement";

export class BaseView extends BaseMainViewElement implements IMainViewElements {
    public onResize(): void {       
    }
}