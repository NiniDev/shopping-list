import { Ingredient } from "./ingredient-model";
import * as uuid from 'uuid';

export class Recipe {
    constructor(
        public title: string,
        public ingredients: Ingredient[],
        public instructions: string[],
        public durations: object[],
        public favorite: boolean,
        public personCount: number,
        private id: string  = uuid.v4(),
    ) { }

    public getIngredients(): Ingredient[] {
        return this.ingredients;
    }

    public getTitle(): string {
        return this.title;
    }

    public getInstructions(): string[] {
        return this.instructions;
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

    public setInstructions(instructions: string[]) {
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
}