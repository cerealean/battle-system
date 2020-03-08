import { BasicAttackType } from "./basic-attack-type";

export class DamageInfo {
    constructor(public baseDamage = 0, public modifier = 1, public type = new BasicAttackType()) {}
    
    /**
     * @returns Returns the base damage times the modifier
     */
    get totalDamage() {
        return this.baseDamage * this.modifier;
    }
};
