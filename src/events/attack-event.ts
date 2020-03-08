import { ChangeEvent } from "./change-event";
import { DamageInfo } from "src/damage-info";
import { Entity } from "src/entity";

export class AttackEvent implements ChangeEvent {
    public damages: DamageInfo[] = [];

    private _cancelled = false;
    private _cancelReason = '';
    private _propogationStopped = false;

    constructor(public readonly performingEntity: Entity, public readonly receivingEntity: Entity) { }

    get Cancelled() {
        return this._cancelled;
    }
    Cancel(reason?: string): void {
        this._cancelled = true;
        if(reason) {
            this._cancelReason = reason;
        }
    }

    get CancelReason() {
        return this._cancelReason;
    }

    get PropogationStopped() {
        return this._propogationStopped;
    }
    StopPropogation() {
        this._propogationStopped = true;
    }
}
