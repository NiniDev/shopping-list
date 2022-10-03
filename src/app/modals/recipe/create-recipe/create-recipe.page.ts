import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, NavParams } from '@ionic/angular';
import { Ingredient } from 'src/app/models/ingredient-model';
import { Recipe } from 'src/app/models/recipe-model';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.page.html',
  styleUrls: ['./create-recipe.page.scss'],
})
export class CreateRecipePage implements OnInit {
  mode: string;
  recipe: Recipe = new Recipe(
    '', [], [], [{ name: 'Gesamtzeit', duration: 0 }], false, 4, []
  );
  private givenMode: string;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    public navParams : NavParams
  ) {
    this.givenMode = this.navParams.get('mode');
  }

  ngOnInit() {
    switch (this.givenMode) {
      case 'create':
        this.mode = 'Neues Rezept erstellen';
        break;
      case 'edit':
        this.mode = 'Rezept bearbeiten';
        this.recipe = this.navParams.get('recipe');
        break;
      default:
        this.mode = 'Neues Rezept erstellen';
        break;
    }
  }

  addIngredient() {
    this.alertController.create({
      header: 'Zutat hinzufügen',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Zutat'
        },
        {
          name: 'amount',
          type: 'number',
          placeholder: 'Menge'
        },
        {
          name: 'unit',
          type: 'text',
          placeholder: 'Einheit'
        }
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Hinzufügen',
          handler: (data) => {
            this.recipe.addIngredient(new Ingredient(data.name, data.amount, data.unit));
          }
        }
      ]
    }).then((alert) => {
      alert.present();
    });
  }

  removeIngredient(ingredient: Ingredient) {
    this.recipe.removeIngredient(ingredient);
  }

  addInstruction() {
    this.alertController.create({
      header: 'Schritt hinzufügen',
      inputs: [
        {
          name: 'instruction',
          type: 'text',
          placeholder: 'Schritt'
        }
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Hinzufügen',
          handler: (data) => {
            this.recipe.addInstruction(data.instruction);
          }
        }
      ]
    }).then((alert) => {
      alert.present();
    });
  }

  removeInstruction(instruction: object) {
    this.recipe.removeInstruction(instruction);
  }

  addDuration() {
    this.alertController.create({
      header: 'Dauer hinzufügen',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name'
        },
        {
          name: 'duration',
          type: 'number',
          placeholder: 'Dauer'
        }
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Hinzufügen',
          handler: (data) => {
            this.recipe.addDuration({ name: data.name, duration: data.duration });
          }
        }
      ]
    }).then((alert) => {
      alert.present();
    });
  }

  removeDuration(duration: object) {
    if (duration['name'] !== 'Gesamtzeit') {
      this.recipe.removeDuration(duration);
    }
  }

  saveRecipe() {
    this.modalController.dismiss(this.recipe, 'save');
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

}
