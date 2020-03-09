import { BasicAttackType } from "./basic-attack-type";
import { AttackType } from "./interfaces/attack-type";

export class DamageInfo {
    private _baseDamage: number;
    private _modifier: number;
    private _hasBeenModified = false;
    private _cancelled = false;

    constructor(baseDamage: number, public readonly type: AttackType, modifier = 1) {
        this._baseDamage = baseDamage;
        this._modifier = modifier;
    }

    get baseDamage() {
        return this._baseDamage;
    }

    set baseDamage(value: number) {
        this._baseDamage = value;
        this._hasBeenModified = true;
    }

    get modifier() {
        return this._modifier;
    }

    set modifier(value: number) {
        this._modifier = value;
        this._hasBeenModified = true;
    }

    get cancelled() {
        return this._cancelled;
    }
    
    /**
     * @returns The base damage times the modifier
     */
    get totalDamage() {
        return this._baseDamage * this._modifier;
    }

    /**
     * @returns Boolean indicating whether the base damage or modifier has changed since the class was initialized
     */
    get hasBeenModified() {
        return this._hasBeenModified;
    }

    /**
     * Will mark this damage info as cancelled. This cannot be undone.
     */
    Cancel() {
        this._cancelled = true;
    }
};
