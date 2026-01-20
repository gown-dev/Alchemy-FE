import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-sprite',
  imports: [
    NgStyle
  ],
  templateUrl: './sprite.component.html',
  styleUrl: './sprite.component.css'
})
export class SpriteComponent {
  @Input() spriteUrl: string | undefined;
  @Input() spritePositionX: number = 0;
  // @Input() spritePositionY: string;

  getStyles() {
    return {
      backgroundImage: `url(${this.spriteUrl || ''})`,
      backgroundPositionX: `${this.spritePositionX * -96}px`
    }
  }
}
