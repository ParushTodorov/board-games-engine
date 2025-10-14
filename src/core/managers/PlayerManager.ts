import { Player } from "../utilies/playerManager/Player";

export class PlayerManager {

    private playerOnTurn!: Player;
    private players: {[key: number]: Player} = {};

    public addPlayer(player: Player) {
        const playerID = Object.keys(this.players).length + 1;
        player.id = playerID;
        this.players[playerID] = player;
    }

    public setScore(playerID: number, score: number) {
        this.players[playerID].points += score;
    }

    public getScore(playerID: number) {
        return this.players[playerID].points;
    }

    public playerOnTurnId() {
        return this.playerOnTurn.id;
    }

    public nextPlaterId() {
        let nextPlayerId = this.playerOnTurn.id + 1;

        if (!Object.keys(this.players).includes(nextPlayerId.toString())) {
            nextPlayerId = 1;
        }

        return nextPlayerId;
    }

    public startGame() {
        this.playerOnTurn = this.players[1];
        Object.values(this.players).forEach(player => player.points = 0);
    }

    public turnEnd() {
        let currentPlayerId = this.playerOnTurn.id;
        currentPlayerId++;
        currentPlayerId = currentPlayerId > Object.keys(this.players).length ? 1 : currentPlayerId;
        this.playerOnTurn = this.players[currentPlayerId]
    }

    public getWinner() {
        const winner = {
            id: 0,
            points: 0
        }
        
        Object.values(this.players).forEach(player => {
            if (player.points > winner.points) {
                winner.id = player.id;
                winner.points = player.points;
            }
        })
    }

    public getScoreMessage() {
        const players = Object.values(this.players);

        let result: string = "";

        if (players.length === 2) {
            players.forEach((player, index) => {
                result += this.singlePlayerScore(player);

                if (index === 0) {
                    result += "     ";
                }
            })
        } else {
            result += this.singlePlayerScore(this.playerOnTurn);
        }

        return result;
    }

    private singlePlayerScore(player: Player) {
        return `Player ${player.id}: ${player.points}`;
    }
}