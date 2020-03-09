export abstract class AttackType {
    constructor(
        public name = '',
        public strongAgainst: AttackType[] = [],
        public weakAgainst: AttackType[] = []
    ) { }
    
    IsStrongAgainst(type: AttackType): boolean {
        return this.strongAgainst.some(sa => sa.name === type.name);
    }

    IsWeakAgainst(type: AttackType): boolean {
        return this.weakAgainst.some(sa => sa.name === type.name);
    }
}