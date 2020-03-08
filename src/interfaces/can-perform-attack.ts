import { AttackEvent } from "src/events/attack-event";

export interface CanPerformAttack {
    PerformAttack(action: AttackEvent): void;
}

export interface HasBeforePerformAttackActions {
    AddOnBeforePerformingAttackAction(action: OnBeforePerformingAttackActionType): void;
    RemoveOnBeforePerformingAttackAction(action: OnBeforePerformingAttackActionType): void;
    ExecuteOnBeforePerformingAttackActions(event: AttackEvent): void;
}

export interface HasAfterPerformAttackActions {
    AddOnAfterPerformingAttackAction(action: OnAfterPerformingAttackActionType): void;
    RemoveOnAfterPerformingAttackAction(action: OnAfterPerformingAttackActionType): void;
    ExecuteOnAfterPerformingAttackActions(event: AttackEvent): void;
}

export type OnBeforePerformingAttackActionType = (event: AttackEvent) => void;
export type OnAfterPerformingAttackActionType = (event: AttackEvent) => void;