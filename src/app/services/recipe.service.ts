import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Recipe } from '../models/recipe-model';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private store;

  constructor() {
    this.init();
  }

  async init() {
    this.store = new Storage();
    await this.store.create();
    // this.store.set('recipes', []);
  }

  async getRecipes() {
    const recipes = await this.store.get('recipes') || [];
    return recipes.map(recipe => {
      return new Recipe(recipe.title, recipe.ingredients, recipe.instructions, recipe.durations, recipe.favorite, recipe.personCount, recipe.id);
    });
  }

  async addRecipe(recipe: Recipe) {
    const recipes = await this.getRecipes();
    recipes.push(recipe);
    await this.store.set('recipes', recipes);
  }

  async removeRecipe(recipe: Recipe) {
    const recipes = await this.getRecipes();
    const index = recipes.findIndex(item => item.getId() === recipe.getId());
    recipes.splice(index, 1);
    await this.store.set('recipes', recipes);
  }

  async updateRecipe(recipe: Recipe, changes: { title?: string, ingredients?: any[], instructions?: object[], durations?: object[], favorite?: boolean, personCount?: number }) {
    const recipes = await this.getRecipes() as Recipe[];
    const index = recipes.findIndex(item => item.getId() === recipe.getId());
    recipes[index].setTitle(changes.title || recipe.getTitle());
    recipes[index].setIngredients(changes.ingredients || recipe.getIngredients());
    recipes[index].setInstructions(changes.instructions || recipe.getInstructions().map(instruction => instruction['text']));
    recipes[index].setDurations(changes.durations || recipe.getDurations());
    recipes[index].setFavorite(changes.favorite || recipe.getFavorite());
    recipes[index].setPersonCount(changes.personCount || recipe.getPersonCount());
    await this.store.set('recipes', recipes);
  }

  async getRecipe(id: string) {
    const recipes = await this.getRecipes();
    console.log(recipes);
    
    return recipes.find(recipe => recipe.getId() === id);
  }

  async getFavorites() {
    const recipes = await this.getRecipes();
    return recipes.filter(recipe => recipe.getFavorite());
  }

  async getFavoritesCount() {
    const recipes = await this.getRecipes();
    return recipes.filter(recipe => recipe.getFavorite()).length;
  }

  async getRecipeCount() {
    const recipes = await this.getRecipes();
    return recipes.length;
  }
}
