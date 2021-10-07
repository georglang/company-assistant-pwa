import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sub-navigation',
  templateUrl: './sub-navigation.component.html',
  styleUrls: ['./sub-navigation.component.scss']
})
export class SubNavigationComponent {
  @Input() title = '';
  @Input() enableBackBtn = false;
  @Output() navigateBack$ = new EventEmitter();

  constructor() {}

  navigateBack(): void {
    this.navigateBack$.emit();
  }
}
