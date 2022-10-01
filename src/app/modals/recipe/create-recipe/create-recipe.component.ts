import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.scss'],
})
export class CreateRecipeComponent implements OnInit {
  mode: string = 'Create';

  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.modalController.getTop().then((modal) => {
      if (modal) {
        switch (modal.componentProps.mode) {
          case "create":
            this.mode = "Neues Rezept erstellen";
            break;
          default:
            this.mode = "Rezept bearbeiten";
            break;
        }
      }
    });
  }

}
