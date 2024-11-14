import { Component, Input } from '@angular/core';

/**
 * Componente responsável por renderizar o menu lateral do ambiente principal da aplicação.
 *
 * @component
 */
@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent {
  @Input() navMenuBtnTitleBegin: string = '';
  @Input() navMenuBtnTitleClasses: string = '';
  /**
   * Título do primeiro botão do menu de navegação.
   *
   * @type {string}
   */
  @Input() navMenuBtnTitleOne: string = '';

  /**
   * Título do segundo botão do menu de navegação.
   *
   * @type {string}
   */
  @Input() navMenuBtnTitleTwo: string = '';

  /**
   * Título do terceiro botão do menu de navegação.
   *
   * @type {string}
   */
  @Input() navMenuBtnTitleThree: string = '';
  @Input() navMenuBtnTitleDisabled: string = '';
  @Input() hideButtonsProfile: boolean = false;
  @Input() navMenuBtnTitleRegistrationData: string = '';
  // @Input() navMenuBtnTitleFour: string = '';
  // @Input() navMenuBtnTitleFive: string = '';
  // @Input() navMenuBtnTitleSix: string = '';
  // @Input() navMenuBtnTitleSeven: string = '';
}
