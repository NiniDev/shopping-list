import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Recipe } from 'src/app/models/recipe-model';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.page.html',
  styleUrls: ['./create-recipe.page.scss'],
})
export class CreateRecipePage implements OnInit {
  mode: string;
  recipe: Recipe;

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.modalController.getTop().then((modal) => {
      switch (modal.componentProps.mode) {
        case 'create':
          this.mode = 'Neues Rezept erstellen';
          break;
        case 'edit':
          this.mode = 'Rezept bearbeiten';
          break;
        default:
          this.mode = 'Neues Rezept erstellen';
          break;
      }
    });
  }

}
