import { Entity, EntityCreationOptions } from "./entity";
import { AttackEvent } from "./events/attack-event";
import { CanReceiveAttack, OnBeforeBeingAttackedActionType, OnAfterBeingAttackedActionType, HasBeforeReceiveAttackActions, HasAfterReceiveAttackActions } from "./interfaces/can-receive-attack";
import { CanPerformAttack, HasBeforePerformAttackActions, OnBeforePerformingAttackActionType, HasAfterPerformAttackActions, OnAfterPerformingAttackActionType } from "./interfaces/can-perform-attack";

export abstract class BattleEntity extends Entity implements
    CanReceiveAttack,
    HasBeforeReceiveAttackActions,
    HasAfterReceiveAttackActions,
    CanPerformAttack,
    HasBeforePerformAttackActions,
    HasAfterPerformAttackActions {
    private _onBeforeBeingAttackedActions: OnBeforeBeingAttackedActionType[] = [];
    private _onAfterBeingAttackedActions: OnAfterBeingAttackedActionType[] = [];
    private _onBeforePerformingAttackActions: OnBeforePerformingAttackActionType[] = [];
    private _onAfterPerformingAttackActions: OnAfterPerformingAttackActionType[] = [];

    constructor(name: string, entityCreationOptions?: EntityCreationOptions) {
        super(name, entityCreationOptions);
    }

    PerformAttack(event: AttackEvent) {

    }

    ReceiveAttack(event: AttackEvent) {

    }

    AddOnBeforeBeingAttackedAction(action: OnBeforeBeingAttackedActionType) {
        this._onBeforeBeingAttackedActions.push(action);
    }

    RemoveOnBeforeBeingAttackedAction(action: OnBeforeBeingAttackedActionType) {
        this._onBeforeBeingAttackedActions = this._onBeforeBeingAttackedActions.filter(a => a != action);
    }

    AddOnAfterBeingAttackedAction(action: OnAfterBeingAttackedActionType) {
        this._onAfterBeingAttackedActions.push(action);
    }

    RemoveOnAfterBeingAttackedAction(action: OnAfterBeingAttackedActionType) {
        this._onAfterBeingAttackedActions = this._onAfterBeingAttackedActions.filter(a => a != action);
    }

    ExecuteOnBeforeBeingAttackedActions(event: AttackEvent) {
        for (let action of this._onBeforeBeingAttackedActions) {
            action(event);
            if (event.PropogationStopped) {
                break;
            }
        }
    }

    ExecuteOnAfterBeingAttackedActions(event: AttackEvent): void {
        for (let action of this._onAfterBeingAttackedActions) {
            action(event);
            if (event.PropogationStopped) {
                break;
            }
        }
    }

    AddOnBeforePerformingAttackAction(action: OnBeforePerformingAttackActionType): void {
        this._onBeforePerformingAttackActions.push(action);
    }

    RemoveOnBeforePerformingAttackAction(action: OnBeforePerformingAttackActionType): void {
        this._onBeforePerformingAttackActions = this._onBeforePerformingAttackActions.filter(a => a != action);
    }

    ExecuteOnBeforePerformingAttackActions(event: AttackEvent): void {
        for (let action of this._onBeforePerformingAttackActions) {
            action(event);
            if (event.PropogationStopped) {
                break;
            }
        }
    }

    AddOnAfterPerformingAttackAction(action: OnAfterPerformingAttackActionType): void {
        this._onAfterPerformingAttackActions.push(action);
    }

    RemoveOnAfterPerformingAttackAction(action: OnAfterPerformingAttackActionType): void {
        this._onAfterPerformingAttackActions = this._onAfterPerformingAttackActions.filter(a => a != action);
    }

    ExecuteOnAfterPerformingAttackActions(event: AttackEvent): void {
        for (let action of this._onAfterPerformingAttackActions) {
            action(event);
            if (event.PropogationStopped) {
                break;
            }
        }
    }

}