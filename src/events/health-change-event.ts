import { ChangeEvent } from "./change-event";

export class HealthChangeEvent implements ChangeEvent {
    private _cancelled = false;

    constructor(public readonly OldHealth: number, public NewHealth: number) {}

    get Cancelled() {
        return this._cancelled;
    }
    Cancel(): void {
        this._cancelled = true;
    }
}
