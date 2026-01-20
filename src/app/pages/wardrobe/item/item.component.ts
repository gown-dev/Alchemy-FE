import { Component, Input } from '@angular/core';
import { SpriteComponent } from '../sprite/sprite.component';
import { WardrobeItem } from '../models/wardrobe-item.interface';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-item',
  imports: [
    SpriteComponent,
    NgForOf
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {
  @Input() item: WardrobeItem | undefined;
  @Input() version: number = 0;
}
