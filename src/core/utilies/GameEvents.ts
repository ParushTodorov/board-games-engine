export class GameEvents {
    public static LOAD_START_ASSETS = "LOAD_START_ASSETS";
    public static LOAD_COMMON_ASSETS = "LOAD_COMMON_ASSETS";
    public static LOAD_GAMEPLAY_ASSETS = "LOAD_GAMEPLAY_ASSETS";

    public static START_NEW_GAME = "START_NEW_GAME";

    public static START_GAME = "START_GAME";
    public static GAME_END = "GAME_END";
    public static GAME_PAUSED = "GAME_PAUSED";
    public static GAME_RESUMED = "GAME_RESUMED";

    public static GAME_COMPONENT_DOWN = "GAME_COMPONENT_DOWN";
    public static GAME_COMPONENT_UP = "GAME_COMPONENT_UP";
    
    public static GORGE_UP = "GORGE_UP";
    public static GORGE_OVER = "GORGE_OVER";
    public static GORGE_OUT = "GORGE_OUT";

    public static PLAY_SOUND = "PLAY_SOUND";
    public static PLAY_LOOP = "PLAY_LOOP";

    // Messages
    public static NEW_MESSAGE = "NEW_MESSAGE";
    public static CLEAR_MESSAGE = "CLEAR_MESSAGE";

    public static SCORE_CHANGE = "SCORE_CHANGE";
    public static PLAYER_CHANGE = "PLAYER_CHANGE"
}