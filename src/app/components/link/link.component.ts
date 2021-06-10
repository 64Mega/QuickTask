import { Component, Input } from '@angular/core';

@Component({
  selector: 'applink',
  template: `<a mat-list-item routerLink="{{ href }}"
    ><ng-content></ng-content
  ></a>`,
})
export class LinkComponent {
  @Input() href!: string;
  constructor() {}
}
