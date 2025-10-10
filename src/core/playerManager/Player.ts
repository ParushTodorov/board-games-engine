export class Player {

    private _id: number = 0;
    private _points: number = 0;

    public set id(id: number) {
        this._id = id;
    }

    public get id() {
        return this._id;
    }

    public set points(points: number) {
        this._points = points;
    }

    public get points() {
        return this._points;
    }
}