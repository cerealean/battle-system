import { ChangeEvent } from "./change-event";

export class BeforeHealthChangeEvent implements ChangeEvent {
    private _cancelled = false;
    private _propogationStopped = false;

    constructor(public readonly oldHealth: number, public newHealth: number) { }

    get Cancelled() {
        return this._cancelled;
    }
    Cancel(): void {
        this._cancelled = true;
    }

    get PropogationStopped() {
        return this._propogationStopped;
    }
    StopPropogation() {
        this._propogationStopped = true;
    }
}

export class AfterHealthChangeEvent implements ChangeEvent {
    private _cancelled = false;
    private _propogationStopped = false;

    constructor(public readonly newHealth: number) { }

    get Cancelled() {
        return this._cancelled;
    }
    Cancel(): void {
        this._cancelled = true;
    }

    get PropogationStopped() {
        return this._propogationStopped;
    }
    StopPropogation() {
        this._propogationStopped = true;
    }
}
