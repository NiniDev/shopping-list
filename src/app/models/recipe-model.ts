import { Ingredient } from "./ingredient-model";
import * as uuid from 'uuid';

export class Recipe {

    constructor(
        public title: string,
        public ingredients: Ingredient[],
        public instructions: object[],
        public durations: object[],
        public favorite: boolean,
        public personCount: number,
        public toShoppingListIngredients: Ingredient[],
        private id?: string
    ) {
        this.id = id || uuid.v4();
    }

    public getIngredients(): Ingredient[] {
        return this.ingredients.map(ingredient => {
            return new Ingredient(ingredient.name, ingredient.amount, ingredient.unit)
        });
    }

    public getTitle(): string {
        return this.title;
    }

    public getInstructions(): object[] {
        return this.instructions
    }

    public getDurations(): object[] {
        return this.durations;
    }

    public getFavorite(): boolean {
        return this.favorite;
    }

    public getPersonCount(): number {
        return this.personCount;
    }

    public getId(): string {
        return this.id;
    }

    public setTitle(title: string) {
        this.title = title;
    }

    public setIngredients(ingredients: Ingredient[]) {
        this.ingredients = ingredients;
    }

    public setInstructions(instructions: object[]) {
        this.instructions = instructions;
    }

    public setDurations(durations: object[]) {
        this.durations = durations;
    }

    public setFavorite(favorite: boolean) {
        this.favorite = favorite;
    }

    public setPersonCount(personCount: number) {
        this.personCount = personCount;
    }

    public addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
    }

    public removeIngredient(ingredient: Ingredient) {
        this.ingredients = this.ingredients.filter((i) => i !== ingredient);
    }

    public addInstruction(instruction: string) {
        this.instructions.push({ text: instruction });
    }

    public removeInstruction(instruction: object) {
        this.instructions = this.instructions.filter((i) => i !== instruction);
    }

    public addDuration(duration: { name: any; duration: any; }) {
        this.durations.push(duration);
    }

    public removeDuration(duration: object) {
        this.durations = this.durations.filter((i) => i !== duration);
    }

    public addToShoppingList(ingredient: Ingredient) {
        this.toShoppingListIngredients.push(ingredient);
    }

    public removeFromShoppingList(ingredient: Ingredient) {
        this.toShoppingListIngredients = this.toShoppingListIngredients.filter((i) => i !== ingredient);
    }

    public getToShoppingListIngredients(): Ingredient[] {
        return this.toShoppingListIngredients;
    }

    public setToShoppingListIngredients(ingredients: Ingredient[]) {
        this.toShoppingListIngredients = ingredients;
    }
}