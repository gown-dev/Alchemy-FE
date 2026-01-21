import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ItemComponent } from './item/item.component';
import { SpriteComponent } from './sprite/sprite.component';
import { WardrobeItem } from './models/wardrobe-item.interface';

const default_sort_order = ['body', 'socks', 'shoes', 'pants', 'shirt', 'cloak', 'hair', 'hat'];

@Component({
  selector: 'app-wardrobe',
  imports: [
    ItemComponent,
    SpriteComponent,
  ],
  templateUrl: './wardrobe.component.html',
  styleUrl: './wardrobe.component.css'
})
export class WardrobeComponent implements OnInit {
  private http = inject(HttpClient);
  wardrobeItems: WardrobeItem[] = [];
  selectedItems: WardrobeItem[] = [];
  bodyItem: WardrobeItem | undefined;
  selectedSortItem: WardrobeItem | undefined;
  selectedVersion: Record<string, number> = {};

  ngOnInit() {
    this.http.get<WardrobeItem[]>('/assets/wardrobe/items.json').subscribe({
      next: (data) => {
        this.bodyItem = data.find(item => item.category === 'body');
        this.wardrobeItems = data.filter(item => item.category !== 'body');
        console.debug('Wardrobe items loaded:', this.wardrobeItems);
        this.selectedItems = [this.bodyItem!];
      },
      error: (error) => {
        console.error('Error loading wardrobe items:', error);
      }
    });
  }

  toggleSelectedItem(item: WardrobeItem) {
    if(this.selectedItems.includes(item)) {
      this.selectedItems = this.selectedItems.filter(i => i !== item);
    } else {
      const index = this.selectedItems.findIndex(selected => {
        return default_sort_order.indexOf(item.category) < default_sort_order.indexOf(selected.category);
      });

      if (index === -1) {
        this.selectedItems.push(item);
      } else {
        this.selectedItems.splice(index, 0, item);
      }
    }
  }

  chooseSelectedVersion(item: WardrobeItem, version: number | undefined) {
    console.debug('Choose version:', item.name, version);
    if (this.selectedSortItem) {
      if(!version) {
        delete this.selectedVersion[item.name];
      } else {
        this.selectedVersion[item.name] = version;
      }
    }
    console.debug('Selected versions:', this.selectedVersion);
  }

  toggleSelectedSortItem(item: WardrobeItem) {
    if (this.selectedSortItem === item) {
      this.selectedSortItem = undefined; // Deselect if already selected
    } else {
      this.selectedSortItem = item; // Select if it's a new item
    }
  }

  sortItemDown(item: WardrobeItem | undefined) {
    if (!item) return;
    const index = this.selectedItems.indexOf(item);
    if (index > 0) {
      this.selectedItems.splice(index, 1);
      this.selectedItems.splice(index - 1, 0, item);
    }
  }
  sortItemUp(item: WardrobeItem | undefined) {
    if (!item) return;
    const index = this.selectedItems.indexOf(item);
    if (index < this.selectedItems.length - 1) {
      this.selectedItems.splice(index, 1);
      this.selectedItems.splice(index + 1, 0, item);
    }
  }

}
