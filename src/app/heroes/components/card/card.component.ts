import { Component, Input, OnInit } from '@angular/core';
import { Hero } from '../../interfaces/hero.interface';

@Component({
  selector: 'component-card',
  templateUrl: './card.component.html',
})
export class CardComponent implements OnInit{

  ngOnInit(): void {
    if (!this.hero) throw Error('Hero property is required')
  }

  @Input()
  public hero!: Hero;


}
