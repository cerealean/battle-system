import { BehaviorSubject, Observable } from 'rxjs';
import { HealthChangeEvent } from './events/health-change-event';

export type OnBeforeHealthChangeAction = (event: HealthChangeEvent) => void;

export class Entity {
    public MaxHealth = 1; 
    public Immortal = false;

    //#region Current Health
    private _currentHealth$ = new BehaviorSubject(this.MaxHealth);
    set CurrentHealth(newHealth: number) {
        const onBeforeEvent = this.ExecuteOnBeforeHealthChangeActions(this._currentHealth$.getValue(), newHealth);
        if(onBeforeEvent.Cancelled) {
            return;
        }

        if(newHealth > this.MaxHealth) {
            this._currentHealth$.next(this.MaxHealth);
        } else if(newHealth < 0){
            this._currentHealth$.next(0);
        } else {
            this._currentHealth$.next(newHealth);
        }
    }
    get CurrentHealth(): number {
        return this._currentHealth$.getValue();
    }
    get OnHealthChange(): Observable<number> {
        return this._currentHealth$.asObservable();
    }
    //#endregion

    //#region OnBeforeHealthChange
    private _onBeforeHealthChangeActions: OnBeforeHealthChangeAction[] = [
        (event) => {
            if(this.Immortal) {
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
            this.MaxHealth = options.MaxHealth;
            this.Immortal = options.Immortal;
        }
    }
}

export class EntityCreationOptions 
{
    MaxHealth = 1;
    Immortal = false;
}

