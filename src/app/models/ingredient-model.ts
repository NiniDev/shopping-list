export class Ingredient {
    constructor(
        public name: string,
        public amount?: number,
        public unit?: string
    ) { }

    toString() {
        if (this.amount && this.unit) {
            return `${this.amount} ${this.unit} ${this.name}`;
        }
        return this.name;
    }

    setAmount(amount: number) {
        this.amount = amount;
    }

    setUnit(unit: string) {
        this.unit = unit;
    }

    setName(name: string) {
        this.name = name;
    }

    getAmount() {
        return this.amount;
    }

    getUnit() {
        return this.unit;
    }

    getName() {
        return this.name;
    }
}