import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BehaviorSubject, Observable } from 'rxjs';

import { ListItem } from '../models/listitem-model';


@Injectable({
  providedIn: 'root'
})
export class ShoppinglistService {
  private store;
  private _shoppingList: BehaviorSubject<ListItem[]> = new BehaviorSubject([]);
  private shoppingList: Observable<ListItem[]> = this._shoppingList.asObservable();

  constructor() {
    this.init();
  }

  async init() {
    this.store = new Storage();
    await this.store.create();
    this.updateObservable();
  }

  getShoppingList(): Observable<ListItem[]> {
    return this.shoppingList;
  }

  private async updateObservable() {
    const shoppingList = await this.store.get('shoppingList');
    this._shoppingList.next(this.mappedShoppinglist(shoppingList) || []);
  }

  private mappedShoppinglist(listItems: any): ListItem[] {
    return listItems.map(listItem => {
      return new ListItem(listItem.ingredient, listItem.checked, listItem.amount, listItem.id);
    });
  }

  async deleteChecked() {
    const shoppingList = this.mappedShoppinglist(await this.store.get('shoppingList') || []);
    const filteredList = shoppingList.filter(listItem => !listItem.getChecked());
    await this.store.set('shoppingList', filteredList);
    this.updateObservable();
  }

  async addListItem(listItem: ListItem) {
    const shoppingList = this.mappedShoppinglist(await this.store.get('shoppingList') || []);
    let needToPush = true;
    // check if item with same name already exists
    if (listItem['ingredient'] instanceof Object) {
      const index = shoppingList.findIndex(item => item['ingredient']['name'] === listItem['ingredient']['name'] );
      // chef if item is already checked and if same unit
      if (index !== -1 && !shoppingList[index]['checked'] && shoppingList[index]['ingredient']['unit'] === listItem['ingredient']['unit']) {
        // add amount to existing item
        console.log('add amount to existing item', shoppingList[index]['ingredient']);
        console.log(shoppingList[index]['ingredient']['amount']);
        shoppingList[index]['ingredient']['amount'] = shoppingList[index]['ingredient']['amount']/1
        shoppingList[index]['ingredient']['amount'] += listItem['ingredient']['amount']/1;
        needToPush = false;
      }
    } else {
      // check if item with same name already exists
      const index = shoppingList.findIndex(item => item['ingredient'] === listItem['ingredient']);
      if (index !== -1 && !shoppingList[index].getChecked()) {
        // add amount to existing item
        shoppingList[index].setAmount(shoppingList[index].getAmount()/1 + listItem.getAmount()/1);
        needToPush = false;
      }
    }
    if (needToPush) {
      shoppingList.push(listItem);
    }
    await this.store.set('shoppingList', shoppingList);
    this.updateObservable();
  }

  async removeListItem(listItem: ListItem) {
    const shoppingList = this.mappedShoppinglist(await this.store.get('shoppingList') || []);
    const index = shoppingList.findIndex(item => item.getId() === listItem.getId());
    shoppingList.splice(index, 1);
    await this.store.set('shoppingList', shoppingList);
    this.updateObservable();
  }

  async updateListItem(listItem: ListItem, changes: { amount?: number, checked?: boolean }) {
    const shoppingList = this.mappedShoppinglist(await this.store.get('shoppingList') || []);
    const index = shoppingList.findIndex(item => item.getId() === listItem.getId());
    shoppingList[index].setAmount(changes.amount || listItem.getAmount());
    shoppingList[index].setChecked(changes.checked || listItem.getChecked());
    await this.store.set('shoppingList', shoppingList);
    this.updateObservable();
  }

  async clearShoppingList() {
    await this.store.remove('shoppingList');
    this.updateObservable();
  }

  async addItems(items: ListItem[]) {
    const shoppingList = this.mappedShoppinglist(await this.store.get('shoppingList') || []);
    items.forEach(item => {
      let needToPush = true;
      // check if item with same name already exists
      if (item['ingredient'] instanceof Object) {
        const index = shoppingList.findIndex(listItem => listItem['ingredient']['name'] === item['ingredient']['name'] );
        // chef if item is already checked and if same unit
        if (index !== -1 && !shoppingList[index]['checked'] && shoppingList[index]['ingredient']['unit'] === item['ingredient']['unit']) {
          // add amount to existing item
          console.log('add amount to existing item', shoppingList[index]['ingredient']);
          console.log(shoppingList[index]['ingredient']['amount']);
          shoppingList[index]['ingredient']['amount'] = shoppingList[index]['ingredient']['amount']/1
          shoppingList[index]['ingredient']['amount'] += item['ingredient']['amount']/1;
          needToPush = false;
        }
      } else {
        // check if item with same name already exists
        const index = shoppingList.findIndex(listItem => listItem['ingredient'] === item['ingredient']);
        if (index !== -1 && !shoppingList[index].getChecked()) {
          // add amount to existing item
          shoppingList[index].setAmount(shoppingList[index].getAmount()/1 + item.getAmount()/1);
          needToPush = false;
        }
      }
      if (needToPush) {
        shoppingList.push(item);
      }
    });
    await this.store.set('shoppingList', shoppingList);
    this.updateObservable();
  }
}
