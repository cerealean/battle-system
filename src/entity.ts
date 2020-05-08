import { BehaviorSubject, Observable } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import {
  BeforeHealthChangeEvent,
  AfterHealthChangeEvent,
} from "./events/health-change-event";

export type OnBeforeHealthChangeAction = (
  event: BeforeHealthChangeEvent
) => void;
export type OnAfterHealthChangeAction = (event: AfterHealthChangeEvent) => void;

export abstract class Entity {
  public immortal = false;
  public readonly identifier = uuidv4();

  private _maxHealth = 1;
  set maxHealth(value: number) {
    if (value <= 0) {
      throw new Error("Maximum health cannot be less than 0");
    }
    this._maxHealth = value;
  }
  get maxHealth() {
    return this._maxHealth;
  }

  // #region Current Health
  private _currentHealth$: BehaviorSubject<number>;
  set currentHealth(newHealth: number) {
    const onBeforeEvent = this.ExecuteOnBeforeHealthChangeActions(
      this._currentHealth$.getValue(),
      newHealth
    );
    if (onBeforeEvent.Cancelled) {
      return;
    }

    if (newHealth > this.maxHealth) {
      this._currentHealth$.next(this.maxHealth);
    } else if (newHealth < 0) {
      this._currentHealth$.next(0);
    } else {
      this._currentHealth$.next(onBeforeEvent.newHealth);
    }

    this.ExecuteOnAfterHealthChangeActions(this._currentHealth$.getValue());
  }
  get currentHealth(): number {
    return this._currentHealth$.getValue();
  }

  get onHealthChange(): Observable<number> {
    return this._currentHealth$.asObservable();
  }
  // #endregion

  // #region OnBeforeHealthChange
  private _onBeforeHealthChangeActions: OnBeforeHealthChangeAction[] = [
    (event) => {
      if (this.immortal) {
        event.Cancel();
      }
    },
  ];
  AddOnBeforeHealthChangeAction(action: OnBeforeHealthChangeAction) {
    this._onBeforeHealthChangeActions.push(action);
  }
  RemoveOnBeforeHealthChangeAction(action: OnBeforeHealthChangeAction) {
    this._onBeforeHealthChangeActions = this._onBeforeHealthChangeActions.filter(
      (actions) => actions != action
    );
  }
  private ExecuteOnBeforeHealthChangeActions(
    oldHealth: number,
    newHealth: number
  ): BeforeHealthChangeEvent {
    const event = new BeforeHealthChangeEvent(oldHealth, newHealth);

    for (let action of this._onBeforeHealthChangeActions) {
      action(event);
      if (event.PropogationStopped) {
        break;
      }
    }

    return event;
  }
  // #endregion

  // #region OnAfterHealthChange
  private _OnAfterHealthChangeActions: OnAfterHealthChangeAction[] = [
    () => {
      if (this._currentHealth$.getValue() === 0) {
        this._currentHealth$.complete();
      }
    },
  ];
  AddOnAfterHealthChangeAction(action: OnAfterHealthChangeAction) {
    this._OnAfterHealthChangeActions.push(action);
  }
  RemoveOnAfterHealthChangeAction(action: OnAfterHealthChangeAction) {
    this._OnAfterHealthChangeActions = this._OnAfterHealthChangeActions.filter(
      (actions) => actions != action
    );
  }
  private ExecuteOnAfterHealthChangeActions(
    newHealth: number
  ): AfterHealthChangeEvent {
    const event = new AfterHealthChangeEvent(newHealth);

    for (let action of this._OnAfterHealthChangeActions) {
      action(event);
      if (event.PropogationStopped) {
        break;
      }
    }

    return event;
  }
  // #endregion

  constructor(public name: string, options?: EntityCreationOptions) {
    if (options) {
      this.maxHealth = options.maxHealth;
      this.immortal = options.immortal;
    }
    this._currentHealth$ = new BehaviorSubject(this.maxHealth);
  }
}

export class EntityCreationOptions {
  maxHealth = 1;
  immortal = false;
}
