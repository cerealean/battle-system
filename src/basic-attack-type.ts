import { AttackType } from "./attack-type";

export class BasicAttackType extends AttackType {
    constructor() {
        super('basic', [], []);
    }
}