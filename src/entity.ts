import { BehaviorSubject, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { HealthChangeEvent } from './events/health-change-event';

export type OnBeforeHealthChangeAction = (event: HealthChangeEvent) => void;

export class Entity {
    public maxHealth = 1; 
    public immortal = false;
    public readonly identifier = uuidv4();

    //#region Current Health
    private _currentHealth$ = new BehaviorSubject(this.maxHealth);
    set currentHealth(newHealth: number) {
        const onBeforeEvent = this.ExecuteOnBeforeHealthChangeActions(this._currentHealth$.getValue(), newHealth);
        if(onBeforeEvent.Cancelled) {
            return;
        }

        if(newHealth > this.maxHealth) {
            this._currentHealth$.next(this.maxHealth);
        } else if(newHealth < 0){
            this._currentHealth$.next(0);
        } else {
            this._currentHealth$.next(newHealth);
        }
    }
    get currentHealth(): number {
        return this._currentHealth$.getValue();
    }
    get onHealthChange(): Observable<number> {
        return this._currentHealth$.asObservable();
    }
    //#endregion

    //#region OnBeforeHealthChange
    private _onBeforeHealthChangeActions: OnBeforeHealthChangeAction[] = [
        (event) => {
            if(this.immortal) {
                event.Cancel();
            }
        }
    ];
    AddOnBeforeHealthChangeAction(action: OnBeforeHealthChangeAction) {
        this._onBeforeHealthChangeActions.push(action);
    }
    RemoveOnBeforeHealthChangeAction(action: OnBeforeHealthChangeAction) {
        this._onBeforeHealthChangeActions = this._onBeforeHealthChangeActions.filter(actions => actions != action);
    }
    private ExecuteOnBeforeHealthChangeActions(oldHealth: number, newHealth: number): HealthChangeEvent {
        const event = new HealthChangeEvent(oldHealth, newHealth);
        this._onBeforeHealthChangeActions.forEach(action => {
            action(event);
        });

        return event;
    }
    //#endregion

    constructor(public Name: string, options?: EntityCreationOptions) {
        if(options) {
            this.maxHealth = options.maxHealth;
            this.immortal = options.immortal;
        }
    }
}

export class EntityCreationOptions 
{
    maxHealth = 1;
    immortal = false;
}

