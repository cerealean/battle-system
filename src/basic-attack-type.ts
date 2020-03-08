import { AttackType } from "./interfaces/attack-type";

export class BasicAttackType extends AttackType {
    constructor() {
        super('basic', [], []);
    }
}