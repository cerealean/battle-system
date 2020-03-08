import { Entity, EntityCreationOptions } from "./entity";
import { DamageInfo } from "./damage";
import { AttackEvent } from "./events/attack-event";

export type OnBeingAttackedActionType = (damages: AttackEvent) => void;
export type OnAfterBeingAttackedActionType = (event: AttackEvent) => void;

export class BattleEntity extends Entity {
    private _onBeforeBeingAttackedActions: OnBeingAttackedActionType[] = [];
    private _onAfterBeingAttackedActions: OnAfterBeingAttackedActionType[] = [];

    constructor(name: string, entityCreationOptions?: EntityCreationOptions) {
        super(name, entityCreationOptions);
    }

    AddOnBeforeBeingAttackedAction(action: OnBeingAttackedActionType) {
        this._onBeforeBeingAttackedActions.push(action);
    }

    RemoveOnBeforeBeingAttackedAction(action: OnBeingAttackedActionType) {
        this._onBeforeBeingAttackedActions = this._onBeforeBeingAttackedActions.filter(a => a != action);
    }

    AddOnAfterBeingAttackedAction(action: OnAfterBeingAttackedActionType) {
        this._onAfterBeingAttackedActions.push(action);
    }

    RemoveOnAfterBeingAttackedAction(action: OnAfterBeingAttackedActionType) {
        this._onAfterBeingAttackedActions = this._onAfterBeingAttackedActions.filter(a => a != action);
    }

    private ExecuteOnBeforeBeingAttackedActions(damages: DamageInfo[]) {
        const event = new AttackEvent(Object.assign(damages));
        for(let action of this._onBeforeBeingAttackedActions) {
            action(event);
            if(event.PropogationStopped) {
                break;
            }
        }

        return event;
    }

    private ExecuteOnAfterBeingAttackedActions(event: AttackEvent) {
        for(let action of this._onAfterBeingAttackedActions) {
            action(event);
        }
    }

    ReceiveAttack(damages: DamageInfo[]) {
        const event = this.ExecuteOnBeforeBeingAttackedActions(damages);
        this.currentHealth -= event.damages.reduce((total, d) => total + d.damageTotal, 0);
        this.ExecuteOnAfterBeingAttackedActions(event);
    }
}