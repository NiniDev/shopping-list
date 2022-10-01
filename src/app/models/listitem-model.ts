import { Ingredient } from "./ingredient-model";
import * as uuid from 'uuid';

export class ListItem {
    constructor(
        public ingredient: Ingredient|string,
        public checked: boolean = false,
        public amount: number,
        private id?: string
    ) {
        this.id = id || uuid.v4();
    }

    toString() {
        if (this.ingredient instanceof Object) {
            return `${this.ingredient.name}`;
        }
        return `${this.amount} ${this.ingredient}`;
    }

    setChecked(checked: boolean) {
        this.checked = checked;
    }

    setAmount(amount: number) {
        this.amount = amount;
    }

    setIngredient(ingredient: Ingredient) {
        this.ingredient = ingredient;
    }

    getChecked() {
        return this.checked;
    }

    getAmount() {
        return this.amount;
    }

    getIngredient() {
        return this.ingredient;
    }

    getId() {
        return this.id;
    }

}