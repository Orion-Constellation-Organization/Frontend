import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent {
  @Input() navMenuBtnTitleOne: string = '';
  @Input() navMenuBtnTitleTwo: string = '';
  @Input() navMenuBtnTitleThree: string = '';
}
