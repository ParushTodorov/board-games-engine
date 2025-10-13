import { Application } from "../../Application";
import { GameEvents } from "../GameEvents";
import { MessageBoard } from "../utilies/viewElements/MessageBoard";

export class MessageManager {

    public messageBoard: MessageBoard;
    public app: Application;

    constructor() {
    }

    public init(messageBoard: MessageBoard) {
        this.messageBoard = messageBoard;   
        this.app = Application.APP;

        this.app.emitter.on(GameEvents.NEW_MESSAGE, this.onNewMessage, this);
        this.app.emitter.on(GameEvents.CLEAR_MESSAGE, this.onClearMessage, this);
    }

    public onNewMessage(text: string) {
        this.messageBoard.setText(text);
    }

    public onClearMessage() {
        this.messageBoard.setText("");
    }
}