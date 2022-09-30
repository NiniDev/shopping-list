import { Ingredient } from "./ingredient-model";
import * as uuid from 'uuid';
export class ListItem {
    constructor(
        public ingredient: Ingredient|string,
        public checked: boolean = false,
        public amount: number,
        private id: string = uuid.v4()
    ) {
    }

    toString() {
        return `${this.amount} ${this.ingredient.toString()}`;
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