import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ListItem } from '../models/listitem-model';
import { ShoppinglistService } from '../services/shoppinglist.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {
  shoppingList: ListItem[] = [];

  constructor(
    private shoppingListService: ShoppinglistService,
    private alertController: AlertController
  ) { }

  async ngOnInit() {
    await this.shoppingListService.deleteChecked();
    this.shoppingListService.getShoppingList().subscribe(listItems => {
      this.shoppingList = listItems;
    });
  }

  toggleChecked(listItem: ListItem) {
    listItem.setChecked(!listItem.getChecked());
    this.shoppingListService.updateListItem(listItem, { checked: listItem.getChecked() });
  }

  getShoppingList(checked: boolean) {
    return this.shoppingList.filter(listItem => listItem.getChecked() === checked);
  }

  addShoppingItem() {
    this.alertController.create({
      header: 'Neuer Einkaufsartikel',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Name'
        },
        {
          name: 'amount',
          type: 'number',
          placeholder: 'Menge'
        }
      ],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel'
        },
        {
          text: 'Hinzufügen',
          handler: async data => {
            const listItem = new ListItem(data.name, false, data.amount);
            await this.shoppingListService.addListItem(listItem);
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  }

  async doRefresh(event) {
    await this.shoppingListService.deleteChecked();
    setTimeout(() => {
      event.target.complete();
    }, Math.random() * 200);
  }

  trackByFn(index, item) {
    return item.id;
  }
}
