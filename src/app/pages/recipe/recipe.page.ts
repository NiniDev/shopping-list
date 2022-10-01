import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Ingredient } from 'src/app/models/ingredient-model';
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
  currentPersonCount = 1;
  ingredients: Ingredient[] = []

  constructor(
    private recipeService: RecipeService,
    private shoppingListService: ShoppinglistService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async ngOnInit() {
    this.recipe = await this.recipeService.getRecipe(this.id);
    this.currentPersonCount = this.recipe.getPersonCount();
    this.ingredients = this.recipe.getIngredients();
  }
  
  async onAddToShoppingList() {
    await this.shoppingListService.addItems(this.recipe.getIngredients().map(ingredient => {      
      return new ListItem(ingredient, false, 1);
    }));
  }

  changePersonCount() {
    this.alertController.create({
      header: 'Anzahl Personen',
      inputs: [
        {
          name: 'personCount',
          type: 'number',
          min: 1,
          value: this.currentPersonCount
        }
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Speichern',
          handler: (data) => {
            this.currentPersonCount = data.personCount;
            this.updateIngedients();
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  }

  updateIngedients() {
    this.ingredients = this.recipe.getIngredients();
    for (let ingredient of this.ingredients) {
      ingredient.setAmount(ingredient.getAmount() * this.currentPersonCount / this.recipe.getPersonCount());
    }
  }

}
