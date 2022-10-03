import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable } from 'rxjs';
import { Recipe } from '../models/recipe-model';
import { Ingredient } from '../models/ingredient-model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private store;
  private _recipes: BehaviorSubject<Recipe[]> = new BehaviorSubject([]);
  recipes: Observable<Recipe[]> = this._recipes.asObservable();

  constructor() {
    this.init();
  }

  async init() {
    this.store = new Storage();
    await this.store.create();
    this.updateObservable();
  }

  getRecipes() {
    return this.recipes;
  }

  private async updateObservable() {
    const recipes = await this.store.get('recipes');
    this._recipes.next(this.mappedRecipes(recipes) || []);
  }

  private mappedRecipes(recipes: any): Recipe[] {
    return recipes.map(recipe => {
      return new Recipe(
        recipe.title,
        recipe.ingredients.map(ingredient => {
          return new Ingredient(ingredient.name, ingredient.amount, ingredient.unit);
        }),
        recipe.instructions,
        recipe.durations,
        recipe.favorite,
        recipe.personCount,
        recipe.id
      );
    });
  }

  async addRecipe(recipe: Recipe) {
    const recipes = this.mappedRecipes(await this.store.get('recipes') || []);
    recipes.push(recipe);
    await this.store.set('recipes', recipes);
    this.updateObservable();
  }

  async removeRecipe(recipe: Recipe) {
    const recipes = this.mappedRecipes(await this.store.get('recipes') || []);
    const index = recipes.findIndex(item => item.getId() === recipe.getId());
    recipes.splice(index, 1);
    await this.store.set('recipes', recipes);
    this.updateObservable();
  }

  async updateRecipe(recipe: Recipe, changes: { title?: string, ingredients?: any[], instructions?: object[], durations?: object[], favorite?: boolean, personCount?: number }) {
    const recipes = this.mappedRecipes(await this.store.get('recipes') || []);
    const index = recipes.findIndex(item => item.getId() === recipe.getId());
    recipes[index].setTitle(changes.title || recipe.getTitle());
    recipes[index].setIngredients(changes.ingredients || recipe.getIngredients());
    recipes[index].setInstructions(changes.instructions || recipe.getInstructions());
    recipes[index].setDurations(changes.durations || recipe.getDurations());
    recipes[index].setFavorite(changes.favorite || recipe.getFavorite());
    recipes[index].setPersonCount(changes.personCount || recipe.getPersonCount());
    await this.store.set('recipes', recipes);
    this.updateObservable();
  }

  async getRecipe(id: string) {
    const recipes = this.mappedRecipes(await this.store.get('recipes') || []);
    return recipes.find(recipe => recipe.getId() === id);
  }

  async getFavorites() {
    const recipes =this.mappedRecipes(await this.store.get('recipes') || []);
    return recipes.filter(recipe => recipe.getFavorite());
  }

  async getFavoritesCount() {
    const recipes = this.mappedRecipes(await this.store.get('recipes') || []);
    return recipes.filter(recipe => recipe.getFavorite()).length;
  }

  async getRecipeCount() {
    const recipes = this.mappedRecipes(await this.store.get('recipes') || []);
    return recipes.length;
  }
}
