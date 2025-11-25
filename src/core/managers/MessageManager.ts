import { Application } from "../../Application";
import { GameEvents } from "../utilies/GameEvents";
import { MessageBoard } from "../utilies/viewElements/MessageBoard";

export class MessageManager {

    protected messageBoard!: MessageBoard;
    protected app!: Application;

    protected currentPlayerInfo!: string;
    protected timeoutChange?: NodeJS.Timeout;
    protected baseDelayInMs: number = 1000;

    constructor() {
    }

    public init(messageBoard: MessageBoard) {
        this.messageBoard = messageBoard;   
        this.app = Application.APP;

        this.app.emitter.on(GameEvents.NEW_MESSAGE, this.onNewMessage, this);
        this.app.emitter.on(GameEvents.CLEAR_MESSAGE, this.onClearMessage, this);
        this.app.emitter.on(GameEvents.PLAYER_CHANGE, this.onPlayerChange, this);
        this.app.emitter.on(GameEvents.SCORE_CHANGE, this.onScoreChange, this);
    }

    public onNewMessage(text: string, delayInMs?: number) {
        this.messageBoard.setText(text);
        
        if (this.timeoutChange) {
            clearTimeout(this.timeoutChange);
            this.timeoutChange = undefined;
        }

        if (delayInMs) {
            this.timeoutChange = setTimeout(() => {
                this.messageBoard.setText(this.currentPlayerInfo);
                clearTimeout(this.timeoutChange);
                this.timeoutChange = undefined;
            }, delayInMs);
        }
    }

    public onClearMessage() {
        this.messageBoard.setText("");
        
        if (this.timeoutChange) {
            clearTimeout(this.timeoutChange);
            this.timeoutChange = undefined;
        }
    }

    public onPlayerChange(player: number) {
        const text = `Player on turn: ${player}`;

        if (!this.timeoutChange) {
            this.messageBoard.setText(text);
        }

        this.currentPlayerInfo = text;
    }

    public onScoreChange(text: string) {
        this.onNewMessage(text, this.baseDelayInMs);
    }
}