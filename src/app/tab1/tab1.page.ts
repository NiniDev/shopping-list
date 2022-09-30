import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../models/ingredient-model';
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
    private shoppingListService: ShoppinglistService
  ) { }

  async ngOnInit() {
    const listitem = new ListItem("Äpfel", false, 2)
    await this.shoppingListService.addListItem(listitem);
    await this.shoppingListService.deleteChecked();
    this.shoppingList = await this.getShoppingList();
  }

  async getShoppingList() {
    return await this.shoppingListService.getShoppingList();
  }

  toggleChecked(listItem: ListItem) {
    listItem.setChecked(!listItem.getChecked());
    this.shoppingListService.updateListItem(listItem, { checked: listItem.getChecked() });
  }

}
