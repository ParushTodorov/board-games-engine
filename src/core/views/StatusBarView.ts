import { Application } from "../../Application";
import { IBaseElementConfig } from "../utilies/interfaces/configs/IBaseElementConfig";
import { BaseMainViewElement } from "../utilies/viewElements/BaseMainViewElement";
import { MessageBoard } from "../utilies/viewElements/MessageBoard";
import { MessageManager } from "../managers/MessageManager";

export class StatusBarView extends BaseMainViewElement {
    protected messageBoard: MessageBoard;
    protected messageManager: MessageManager;
    protected statusBarConfig: IBaseElementConfig;

    constructor(statusBarConfig: IBaseElementConfig) {
        super();

        this.statusBarConfig = statusBarConfig;
    }

    public init() {
        this.messageBoard = new MessageBoard(this.statusBarConfig);
        this.addChild(this.messageBoard);

        this.messageManager = Application.APP.managerHub.messageManager;
        this.messageManager.init(this.messageBoard);

        this.onResize();
    }

    public onResize() {
        this.messageBoard.onResize();
    }
}