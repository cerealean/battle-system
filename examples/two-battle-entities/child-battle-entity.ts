import { EntityCreationOptions } from "../../src/entity";
import { BattleEntity } from "../../src/battle-entity";
import { AttackEvent } from "../../src/events/attack-event";
import { DamageInfo } from "../../src/damage-info";

export abstract class ChildBattleEntity extends BattleEntity {
    constructor(name: string, entityCreationOptions?: EntityCreationOptions) {
        super(name, entityCreationOptions);
    }

    ReceiveAttack(event: AttackEvent): void {
        this.currentHealth -= (Array.from(event.damages.values()) as DamageInfo[]).reduce((total, cur) => {
            return cur.cancelled ? 0 : total += cur.totalDamage;
        }, 0);
    }
}