import { DamageInfo } from '../../src/damage-info';
import { AttackEvent } from '../../src/events/attack-event';
import { EntityCreationOptions } from '../../src/entity';
import { TBEAttackTypes } from './tbe-attack-types';
import { ChildBattleEntity } from './child-battle-entity';

export class Warrior extends ChildBattleEntity {
    private _strength = Math.floor(Math.random() * 10);
    private _defense = 2;

    constructor(name: string, entityCreationOptions?: EntityCreationOptions) {
        super(name, entityCreationOptions);
        this.AddOnBeforePerformingAttackAction(() => {
            console.log(`${this.name} takes a deep breath to steady before attacking`)
        });
        this.AddOnBeforeBeingAttackedAction((event: AttackEvent) => {
            if(event.damages.has(TBEAttackTypes.basic)) {
                (Array.from(event.damages.values()) as DamageInfo[]).forEach(di => di.modifier -= (this._defense / 100));
            }
        });
    }

    PerformAttack(event: AttackEvent): void {
        const luck = Math.random();
        const damageAmount = this._strength + (this._strength * luck);
        event.damages.set(TBEAttackTypes.basic, new DamageInfo(damageAmount, TBEAttackTypes.basic))
    }

}