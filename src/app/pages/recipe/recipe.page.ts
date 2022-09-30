import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListItem } from 'src/app/models/listitem-model';
import { Recipe } from 'src/app/models/recipe-model';
import { RecipeService } from 'src/app/services/recipe.service';
import { ShoppinglistService } from 'src/app/services/shoppinglist.service';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.page.html',
  styleUrls: ['./recipe.page.scss'],
})
export class RecipePage implements OnInit {
  id = this.router.url.split('/')[2];
  recipe: Recipe;

  constructor(
    private recipeService: RecipeService,
    private shoppingListService: ShoppinglistService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.recipe = await this.recipeService.getRecipe(this.id);
  }
  
  onAddToShoppingList() {
    this.recipe.getIngredients().forEach(ingredient => {
      this.shoppingListService.addListItem(
        new ListItem(ingredient, false, 1)
      );
    });
  }

}
