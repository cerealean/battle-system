import { ChangeEvent } from "./change-event";
import { DamageInfo } from "src/damage";

export class AttackEvent implements ChangeEvent {
    private _cancelled = false;
    private _propogationStopped = false;

    constructor(public damages: DamageInfo[]) { }

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
