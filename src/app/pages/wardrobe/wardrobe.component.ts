import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ItemComponent } from './item/item.component';
import { SpriteComponent } from './sprite/sprite.component';
import { WardrobeItem } from './models/wardrobe-item.interface';
import { interval, animationFrameScheduler } from 'rxjs';

const default_sort_order = ['body', 'socks', 'shoes', 'pants', 'shirt', 'cloak', 'hair', 'hat'];

export interface WardrobeCustomization {
  version: number | undefined;
  hueRotate: number | undefined;
  greyscale: boolean | undefined;
  color: string | undefined;
  colorBlend: string | undefined;
  brightness: number | undefined;
  contrast: number | undefined;
  saturation: number | undefined;
}
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
  customizations: Record<string, WardrobeCustomization> = {};
  animating: boolean = false;
  animationStartFrame: number = 0;
  animationEndFrame: number = 5;
  animationDisplayFrame: number = 0;

  ngOnInit() {
    this.http.get<WardrobeItem[]>('/assets/wardrobe/items.json').subscribe({
      next: (data) => {
        this.bodyItem = data.find(item => item.category === 'body');
        this.wardrobeItems = data.filter(item => item.category !== 'body');
        console.debug('Wardrobe items loaded:', this.wardrobeItems);
        this.selectedItems = [this.bodyItem!];

        this.startIntervalAnimation();
      },
      error: (error) => {
        console.error('Error loading wardrobe items:', error);
      }
    });
  }

  startIntervalAnimation() {
    interval(150, animationFrameScheduler).subscribe(() => {
      console.debug('Animation frame');
      if(this.animating) {
        this.animationDisplayFrame++;
        if(this.animationDisplayFrame > this.animationEndFrame) {
          this.animationDisplayFrame = this.animationStartFrame;
        }
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
    let customization = this.customizations[item.name] || {};
    if(!version) {
      customization.version = 0;
    } else {
      customization.version = version;
    }
    this.customizations[item.name] = customization;
    console.debug('Selected versions:', this.customizations[item.name].version);
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

  onHueChange(item: WardrobeItem, event: Event) {
    const hueRotate = (event.target as HTMLInputElement).value;
    this.changeHueRotate(item, hueRotate);
  }

  changeHueRotate(item: WardrobeItem | undefined, value: string) {
    if (!item) return;
    let customization = this.customizations[item.name] || {};
    customization.hueRotate = parseInt(value, 10);
    this.customizations[item.name] = customization;
  }

  onGreyscaleChange(item: WardrobeItem, event: Event) {
    const greyscale = (event.target as HTMLInputElement).checked;
    this.changeGreyscale(item, greyscale);
  }

  changeGreyscale(item: WardrobeItem, value:boolean) {
    if (!item) return;
    let customization = this.customizations[item.name] || {};
    customization.greyscale = value;
    this.customizations[item.name] = customization;
    console.debug('customizations', this.customizations);
  }

  onColorChange(item: WardrobeItem, event: Event) {
    const color = (event.target as HTMLInputElement).value;
    this.changeColor(item, color);
  }

  changeColor(item: WardrobeItem, value:string) {
    if (!item) return;
    let customization = this.customizations[item.name] || {};
    customization.color = value;
    this.customizations[item.name] = customization;
  }

  onColorBlendChange(item: WardrobeItem, event: Event) {
    const colorBlend = (event.target as HTMLInputElement).value;
    this.changeColorBlend(item, colorBlend);
  }

  changeColorBlend(item: WardrobeItem, value:string) {
    if (!item) return;
    let customization = this.customizations[item.name] || {};
    customization.colorBlend = value;
    this.customizations[item.name] = customization;
  }

  onBrightnessChange(item: WardrobeItem, event: Event) {
    const brightness = (event.target as HTMLInputElement).value;
    this.changeBrightness(item, brightness);
  }

  changeBrightness(item: WardrobeItem, value: string) {
    if (!item) return;
    let customization = this.customizations[item.name] || {};
    customization.brightness = parseInt(value, 10);
    this.customizations[item.name] = customization;
  }

  onContrastChange(item: WardrobeItem, event: Event) {
    const contrast = (event.target as HTMLInputElement).value;
    this.changeContrast(item, contrast);
  }

  changeContrast(item: WardrobeItem, value: string) {
    if (!item) return;
    let customization = this.customizations[item.name] || {};
    customization.contrast = parseInt(value, 10);
    this.customizations[item.name] = customization;
  }

  onSaturationChange(item: WardrobeItem, event: Event) {
    const saturation = (event.target as HTMLInputElement).value;
    this.changeSaturation(item, saturation);
  }

  changeSaturation(item: WardrobeItem, value: string) {
    if (!item) return;
    let customization = this.customizations[item.name] || {};
    customization.saturation = parseInt(value, 10);
    this.customizations[item.name] = customization;
  }

  resetCustomizations(item: WardrobeItem) {
    if(!item) return;
    delete this.customizations[item.name];
  }

  toggleAnimation() {
    this.animating = !this.animating;
    if (!this.animating) {
      this.animationDisplayFrame = 0;
    }
  }

}
