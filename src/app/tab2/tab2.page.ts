import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Ingredient } from '../models/ingredient-model';
import { Recipe } from '../models/recipe-model';
import { RecipeService } from '../services/recipe.service';
import { CreateRecipePage } from '../modals/recipe/create-recipe/create-recipe.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
  recipes: Recipe[] = [] as Recipe[];

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    const ingredients = [
      new Ingredient('Kartoffel(n), vorwiegend festkochend', 500, 'g'),
      new Ingredient('Olivenöl', 4, 'EL'),
      new Ingredient('Salz', 0.5, 'EL'),
      new Ingredient('Pfeffer', 0.5, 'EL'),
      new Ingredient('Paprikapulver', 0.5, 'EL'),
      new Ingredient('Oregano, gerebelt bzw. Pizzagewürz', 0.5, 'EL'),
      new Ingredient('Gewürzsalz für Hähnchen, optional', 0, 'etwas'),
      new Ingredient('Crème fraîche', 1, 'Becher'),
      new Ingredient('Salz', 0, 'etwas'),
      new Ingredient('Pfeffer', 0, 'etwas'),
      new Ingredient('Knoblauch, fein gehackt', 1, 'Zehe/n'),
      new Ingredient('Knoblauchgranulat', 0, 'etwas'),
      new Ingredient('Kräuter, z. B. Schittlauch, Petersilie', 0, 'einige'),
    ];
    const instructions = [
      {
        text: `Den Backofen bei Umluft und ca 200 Grad vorheizen. Das Backblech mit im Ofen lassen, damit es nachher schon gut heiß ist.
      Die Kartoffeln gründlich waschen (nicht schälen) und in gleichgroße/gleichdicke Schnitze schneiden.
      Für die Marinade alle restlichen Zutaten in einer Schüssel vermengen. Ich schmecke immer nochmal alles ab. Manche mögen es mal etwas salziger oder schärfer. Dann die noch rohen Wedges zu der Marinade geben und unterheben, damit alles gleichmäßg verteilt wird.
      Das Backblech aus dem Ofen holen und mit Backpapier auslegen. Die marinierten Wedges auf das Blech geben und darauf achten, dass alle möglichst einzeln verteilt sind und nicht aufeinander kleben. Dann das Blech für ca 25 - 30 Minuten in den Ofen geben.
      Ich schaue nach ca 25 min. immer mal wieder nach den Wedges, weil sie ja nicht zusammenschrumpeln und trocken werden sollen. Am Besten gegen Ende der Zeit mal probieren, ob sie durch sind.
      Für den Dip:
      Alle Zutaten miteinander vermengen und nochmals abschmecken.`}
    ];
    const durations = [
      { name: 'Arbeitszeit', duration: 15 },
      { name: 'Koch-/Backzeit', duration: 25 },
      { name: 'Gesamtzeit', duration: 40 },
    ];
    const recipe = new Recipe('Potatoe Wedges mit Knoblauch Dip', ingredients, instructions, durations, true, 2, ingredients);
    // await this.recipeService.addRecipe(recipe);
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes;
    });
  }

  getTotalDurationString(recipe) {
    const durations = recipe.getDurations();
    let dur;
    durations.forEach(element => {
      if (element.name === 'Gesamtzeit') {
        dur = element.duration;
      }
    });
    return dur + ' Minuten';
  }

  openRecipe(recipe) {
    this.router.navigate(['/recipe', recipe.getId()]);
  }

  createRecipe() {
    this.modalController.create({
      component: CreateRecipePage,
      componentProps: {
        mode: 'create'
      }
    }).then(modalEl => {
      modalEl.present();
      return modalEl.onDidDismiss();
    }).then(async resultData => {
      console.log(resultData.data, resultData.role);
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
          let message = 'Folgende Felder wurden nicht ausgefüllt: ';
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
                  await this.recipeService.addRecipe(resultData.data);
                }
              }
            ]
          }).then(alertEl => { alertEl.present(); });
        } else {
          await this.recipeService.addRecipe(resultData.data);
        }
      }
    })
  }

  deleteRecipe(recipe) {
    this.alertController.create({
      header: 'Achtung',
      message: 'Rezept wirklich löschen?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Löschen',
          handler: async () => {
            await this.recipeService.removeRecipe(recipe);
          }
        }
      ]
    }).then(alertEl => { alertEl.present(); });
  }
}
