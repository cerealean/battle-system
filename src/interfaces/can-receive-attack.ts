import { AttackEvent } from "src/events/attack-event";

export interface CanReceiveAttack {
    ReceiveAttack(event: AttackEvent): void;
}

export interface HasBeforeReceiveAttackActions {
    AddOnBeforeBeingAttackedAction(action: OnBeforeBeingAttackedActionType): void;
    RemoveOnBeforeBeingAttackedAction(action: OnBeforeBeingAttackedActionType): void;
    ExecuteOnBeforeBeingAttackedActions(event: AttackEvent): void;
}

export interface HasAfterReceiveAttackActions {
    AddOnAfterBeingAttackedAction(action: OnAfterBeingAttackedActionType): void;
    RemoveOnAfterBeingAttackedAction(action: OnAfterBeingAttackedActionType): void;
    ExecuteOnAfterBeingAttackedActions(event: AttackEvent): void;
}

export type OnBeforeBeingAttackedActionType = (event: AttackEvent) => void;
export type OnAfterBeingAttackedActionType = (event: AttackEvent) => void;
