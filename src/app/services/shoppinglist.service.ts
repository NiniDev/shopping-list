import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { ListItem } from '../models/listitem-model';


@Injectable({
  providedIn: 'root'
})
export class ShoppinglistService {
  private store;

  constructor() {
    this.init();
  }

  async init() {
    this.store = new Storage();
    await this.store.create();
    console.log('Storage initialized');
  }

  async deleteChecked() {
    const shoppingList = await this.getShoppingList();
    const filteredList = shoppingList.filter(listItem => !listItem.getChecked());
    await this.store.set('shoppingList', filteredList);
  }

  async getShoppingList() {
    const shoppingList = await this.store.get('shoppingList') || [];
    return shoppingList.map(listItem => new ListItem(listItem.ingredient, listItem.checked, listItem.amount, listItem.id));
  }

  async addListItem(listItem: ListItem) {
    const shoppingList = await this.getShoppingList();
    shoppingList.push(listItem);
    await this.store.set('shoppingList', shoppingList);
  }

  async removeListItem(listItem: ListItem) {
    const shoppingList = await this.getShoppingList();
    const index = shoppingList.findIndex(item => item.getId() === listItem.getId());
    shoppingList.splice(index, 1);
    await this.store.set('shoppingList', shoppingList);
  }

  async updateListItem(listItem: ListItem, changes: { amount?: number, checked?: boolean }) {
    const shoppingList = await this.getShoppingList() as ListItem[];
    const index = shoppingList.findIndex(item => item.getId() === listItem.getId());
    shoppingList[index].setAmount(changes.amount || listItem.getAmount());
    shoppingList[index].setChecked(changes.checked || listItem.getChecked());
    await this.store.set('shoppingList', shoppingList);
  }

  async clearShoppingList() {
    await this.store.remove('shoppingList');
  }

  async addItems(items: ListItem[]) {
    const shoppingList = await this.getShoppingList();
    shoppingList.push(...items);
    await this.store.set('shoppingList', shoppingList);
  }
}
