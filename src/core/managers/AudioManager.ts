import { Application } from "../../Application";
import { GameEvents } from "../utilies/GameEvents";
import { Howl } from "howler";

export class AudioManager {
    private app: Application;

    public init() {
        this.app = Application.APP;

        this.app.emitter.on(GameEvents.PLAY_SOUND, this.play, this);
        this.app.emitter.on(GameEvents.PLAY_LOOP, this.playLoop, this);
        this.app.emitter.on(GameEvents.STOP_SOUND, this.stop, this);
    }

    public async play(audioName: string, volume: number = 1, loop: boolean = false): Promise<Howl | null> {
        try {
            const audio: Howl = await this.app.assetManager.getAudio(audioName);
            audio.loop(loop)
            audio.volume(volume);
            audio.play();

            return audio;
        } catch (error) {
            console.warn(error);
            return null;
        }
    }

    public async playLoop(audioName: string, volume: number = 1): Promise<Howl | null> {
        try {
            return this.play(audioName, volume, true);
        } catch (error) {
            console.warn(error);
            return null;
        }
    }

    public async stop(audioName: string) {
        try {
            const audio: Howl = await this.app.assetManager.getAudio(audioName);
            audio.stop();

            return audio;
        } catch (error) {
            console.warn(error);
            return null;
        }
    }
}