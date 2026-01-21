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
  @Input() hueRotate: number | undefined;
  @Input() greyscale: boolean | undefined;
  @Input() color: string | undefined;

  getStyles() {
    let filters = [];
    if (this.greyscale) filters.push('grayscale(100%)');
    if (this.hueRotate) filters.push(`hue-rotate(${this.hueRotate}deg)`);

    return {
      backgroundImage: `url(${this.spriteUrl || ''})`,
      backgroundPositionX: `${this.spritePositionX * -80}px`,
      filter: filters.length ? filters.join(' ') : undefined,
    }
  }

  getColorStyles() {
    // let filters = [];
    // if (this.greyscale) filters.push('grayscale(100%)');
    // if (this.hueRotate) filters.push(`hue-rotate(${this.hueRotate}deg)`);

    return {
      mask: `url(${this.spriteUrl || ''})`,
      maskPositionX: `${this.spritePositionX * -80}px`,
      mixBlendMode: 'multiply',
      backgroundColor: this.color,
      // filter: filters.length ? filters.join(' ') : undefined,
    }
  }
}
