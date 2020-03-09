import { Warrior } from "./warrior";
import { BattleOrchestrator } from '../../src/battle-orchestrator';

const foo = new Warrior('foo', {maxHealth: 50, immortal: false});
const bar = new Warrior('bar', {maxHealth: 50, immortal: false});
const orchestrator = new BattleOrchestrator();
let shouldStop = false;
foo.onHealthChange.subscribe(health => {
    if(health <= 0) {
        shouldStop = true;
    }
});
bar.onHealthChange.subscribe(health => {
    if(health <= 0) {
        shouldStop = true;
    }
});

do {
    const ev1 = orchestrator.ExecuteAttack(foo, bar);
    const ev2 = orchestrator.ExecuteAttack(bar, foo);
    console.log(`${ev1.performingEntity.name} attacks ${ev1.receivingEntity.name} leaving ${ev1.receivingEntity.name} with ${ev1.receivingEntity.currentHealth} health`);
    console.log(`${ev2.performingEntity.name} attacks ${ev2.receivingEntity.name} leaving ${ev2.receivingEntity.name} with ${ev2.receivingEntity.currentHealth} health`);
} while (shouldStop === false)