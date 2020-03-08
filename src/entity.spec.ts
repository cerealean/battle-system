import { expect } from "chai";
import { Entity, OnBeforeHealthChangeAction } from "./entity";
import { HealthChangeEvent } from "./events/health-change-event";

describe('Entity', () => {
    let entity: Entity;

    beforeEach(() => {
        entity = new Entity(new Date().getTime().toString());
    });

    it('should get a guid as an identifier upon creation', () => {
        const guidRegex = /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/;
        expect(entity.identifier).to.match(guidRegex);
    });

    it('should get a unique guid as an identifier upon creation', () => {
        const secondEntity = new Entity('');
        const thirdEntity = new Entity('');

        expect(entity.identifier).to.not.equal(secondEntity.identifier).and.to.not.equal(thirdEntity.identifier);
    });

    describe('max health', () => {
        [-1, -30, -500, -27, -92, -15].forEach(maxHealth => {
            it(`should not allow negative numbers (${maxHealth})`, () => {
                expect(() => entity.maxHealth = maxHealth).to.throw(Error)
            });
        });

        it('should not allow 0', () => {
            expect(() => entity.maxHealth = 0).to.throw(Error);
        });
    });
    
    describe('On Health Change', () => {

        [135, 15, 10, 100, 50].forEach(maxHealth => {
            it(`should only allow health to be up to max health (${maxHealth})`, () => {
                const healthToSet = maxHealth + 25;
                entity.maxHealth = maxHealth;
                entity.currentHealth = healthToSet;
                expect(entity.currentHealth).equals(entity.maxHealth);
            });
        });

        it('should not allow health changes if immortal', () => {
            entity.maxHealth = 150;
            entity.currentHealth = 25;
            expect(entity.currentHealth).equals(25);

            entity.immortal = true;
            entity.currentHealth += 50;
            expect(entity.currentHealth).equals(25);

            entity.immortal = false;
            entity.currentHealth -= 5;
            expect(entity.currentHealth).equals(20);
        });

        it('should execute onbeforehealth actions on health changes', () => {
            let counter = 0;
            entity.AddOnBeforeHealthChangeAction(() => counter++);

            entity.currentHealth += 1;
            entity.currentHealth += 1;

            expect(counter).to.equal(2);
        });

        it('should allow changes to new health while executing onbeforehealth actions', () => {
            entity.maxHealth = 50;
            entity.currentHealth = 50;
            entity.AddOnBeforeHealthChangeAction(event => {
                event.newHealth -= 35;
            });

            entity.currentHealth = 49;

            expect(entity.currentHealth).to.equal(49 - 35);
        });

        it('should allow removing onbeforehealth actions', () => {
            entity.maxHealth = 50;
            entity.currentHealth = 50;
            const action: OnBeforeHealthChangeAction = (event: HealthChangeEvent) => {
                event.newHealth = 0;
            };
            entity.AddOnBeforeHealthChangeAction(action);
            entity.currentHealth = 49;
            expect(entity.currentHealth).to.equal(0);

            entity.RemoveOnBeforeHealthChangeAction(action);
            entity.currentHealth = 35;
            expect(entity.currentHealth).to.equal(35);
        });

        it('should receive events when current health is changed', () => {
            let counter = 0;
            const sub = entity.onHealthChange.subscribe(() => {
                counter++;
            });
            entity.maxHealth = 50;

            entity.currentHealth = 1;
            entity.currentHealth++;
            entity.currentHealth += 5;

            expect(counter).to.equal(4); //Note: because it is a BehaviorSubject, as soon as we subscribe we receive 1 event
            sub.unsubscribe();
        });

        it('should stop propogation if requested', () => {
            let counter = 0;
            entity.AddOnBeforeHealthChangeAction(event => {
                counter++;
                event.StopPropogation();
            });
            entity.AddOnBeforeHealthChangeAction(() => {
                throw new Error('should not get here');
            });

            entity.currentHealth++;
            entity.currentHealth--;

            expect(counter).to.equal(2);
        });

    });

});
