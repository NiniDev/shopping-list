import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { CreateRecipePage } from 'src/app/modals/recipe/create-recipe/create-recipe.page';
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
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.recipe = await this.recipeService.getRecipe(this.id);
    this.currentPersonCount = this.recipe.getPersonCount();
    this.ingredients = this.recipe.getIngredients();
  }
  
  async onAddToShoppingList() {
    const ingredients = this.recipe.getToShoppingListIngredients();
    const items = [];
    for (let ingredient of ingredients) {
      const amount = ingredient.amount * this.currentPersonCount / this.recipe.getPersonCount()
      const listItem = new ListItem(ingredient.unit + " " + ingredient.name, false, amount);
      items.push(listItem);
    }
    await this.shoppingListService.addItems(items);
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

  toggleFavorite() {
    this.recipe.setFavorite(!this.recipe.getFavorite());
    this.recipeService.updateRecipe(this.recipe, this.recipe);
  }

  onEditRecipe() {
    this.modalController.create({
      component: CreateRecipePage,
      componentProps: {
        mode: 'edit',
        recipe: this.recipe
      }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(async resultData => {
      if (resultData.role === 'save') {
        let notGiven = [];
        if (!resultData.data.title) {
          notGiven.push('Titel');
        }
        if (!resultData.data.ingredients.length) {
          notGiven.push('Zutaten');
        }
        if (!resultData.data.instructions.length) {
          notGiven.push('Anleitung');
        }
        if (notGiven.length > 0) {
          let message = 'Folgende Felder sind nicht ausgefüllt: ';
          notGiven.forEach(element => {
            message += element + ', ';
          });
          message = message.slice(0, -2);
          message += '. Trotzdem speichern?';
          this.alertController.create({
            header: 'Achtung',
            message: message,
            buttons: [
              {
                text: 'Abbrechen',
                role: 'cancel'
              },
              {
                text: 'Speichern',
                handler: async () => {
                  await this.recipeService.updateRecipe(resultData.data, resultData.data);
                }
              }
            ]
          }).then(alertEl => { alertEl.present(); });
        } else {
          await this.recipeService.updateRecipe(resultData.data, resultData.data);
        }
        this.updateIngedients();
      }
    })
  }

  onWillDismiss(event: Event) {
    const ev = event
    if (ev['detail'].data.save) {
      console.log(this.recipe.toShoppingListIngredients);
      this.recipeService.updateRecipe(this.recipe, this.recipe);
    }
  }

  // Modal

  addToShoppingListList(ingredient: Ingredient) {
    this.recipe.addToShoppingList(ingredient);
  }

  removeFromShoppingListList(ingredient: Ingredient) {
    this.recipe.removeFromShoppingList(ingredient);
  }

  saveModalChanges(save: boolean) {
    this.modalController.dismiss({
      'save': save,
    });
  }
}
