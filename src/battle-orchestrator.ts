import { Entity } from "./entity";
import { CanPerformAttack, HasBeforePerformAttackActions, HasAfterPerformAttackActions } from './interfaces/can-perform-attack';
import { AttackEvent } from "./events/attack-event";
import { CanReceiveAttack, HasBeforeReceiveAttackActions, HasAfterReceiveAttackActions } from "./interfaces/can-receive-attack";

export class BattleOrchestrator {

    /**
     * Execute an attack between two entities. The "performing" entity is attacking the "receiving" entity, essentially.
     * 
     * Events go in this order:
     * 0. BeforePerformingAttack Actions from the "performing" entity
     * 0. PerformAttack from the "performing" entity
     * 0. BeforeBeingAttacked Actions from the "receiving" entity
     * 0. ReceiveAttack from the "receiving" entity
     * 0. AfterBeingAttacked Actions from the "receiving" entity
     * 0. AfterPerformingAttack Actions from the "performing" entity
     * 
     * _Calling Cancel on the event in any action will stop the remaining actions from being called._
     * 
     * @param performingEntity Entity performing the attack
     * @param receivingEntity Entity receiving the attack
     * @returns The AttackEvent which was passed between all events
     */
    ExecuteAttack(performingEntity: Entity, receivingEntity: Entity): AttackEvent {
        const attackEvent = new AttackEvent(performingEntity, receivingEntity);
        if(!this.IsCanPerformAttack(performingEntity)) {
            attackEvent.Cancel(`Entity ${performingEntity.name} (identifier ${performingEntity.identifier}) does not implement CanPerformAttack`);

            return attackEvent;
        }
        if(!this.IsCanReceiveAttack(receivingEntity)) {
            attackEvent.Cancel(`Entity ${receivingEntity.name} (identifier ${receivingEntity.identifier}) does not implement CanReceiveAttack`);

            return attackEvent;
        }
        if(this.IsHasBeforePerformAttackActions(performingEntity)) {
            performingEntity.ExecuteOnBeforePerformingAttackActions(attackEvent);
        }
        if(!attackEvent.Cancelled) {
            performingEntity.PerformAttack(attackEvent);
        }
        if(!attackEvent.Cancelled && this.IsHasBeforeReceiveAttackActions(receivingEntity)) {
            receivingEntity.ExecuteOnBeforeBeingAttackedActions(attackEvent);
        }
        if(!attackEvent.Cancelled) {
            receivingEntity.ReceiveAttack(attackEvent);
        }
        if(!attackEvent.Cancelled && this.IsHasAfterReceiveAttackActions(receivingEntity)) {
            receivingEntity.ExecuteOnAfterBeingAttackedActions(attackEvent);
        }
        if(!attackEvent.Cancelled && this.IsHasAfterPerformAttackActions(performingEntity)) {
            performingEntity.ExecuteOnAfterPerformingAttackActions(attackEvent);
        }

        return attackEvent;
    }

    private IsCanPerformAttack(entity: Entity | CanPerformAttack): entity is CanPerformAttack {
        return (entity as CanPerformAttack).PerformAttack !== undefined;
    }

    private IsHasBeforePerformAttackActions(entity: Entity | HasBeforePerformAttackActions): entity is HasBeforePerformAttackActions {
        return (entity as HasBeforePerformAttackActions).ExecuteOnBeforePerformingAttackActions !== undefined;
    }

    private IsHasAfterPerformAttackActions(entity: Entity | HasAfterPerformAttackActions): entity is HasAfterPerformAttackActions {
        return (entity as HasAfterPerformAttackActions).ExecuteOnAfterPerformingAttackActions !== undefined;
    }

    private IsCanReceiveAttack(entity: Entity | CanReceiveAttack): entity is CanReceiveAttack {
        return (entity as CanReceiveAttack).ReceiveAttack !== undefined;
    }
    
    private IsHasBeforeReceiveAttackActions(entity: Entity | HasBeforeReceiveAttackActions): entity is HasBeforeReceiveAttackActions {
        return (entity as HasBeforeReceiveAttackActions).ExecuteOnBeforeBeingAttackedActions !== undefined;
    }

    private IsHasAfterReceiveAttackActions(entity: Entity | HasAfterReceiveAttackActions): entity is HasAfterReceiveAttackActions {
        return (entity as HasAfterReceiveAttackActions).ExecuteOnAfterBeingAttackedActions !== undefined;
    }

}