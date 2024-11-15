import { Component, Input, Output, EventEmitter } from '@angular/core';

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
  /**
   * Título do botão inicial do menu de navegação.
   *
   * @type {string}
   */
  @Input() navMenuBtnTitleBegin: string = '';

  /**
   * Classes CSS a serem aplicadas aos botões do menu de navegação.
   *
   * @type {string}
   */
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

  /**
   * Título do botão desabilitado do menu de navegação.
   *
   * @type {string}
   */
  @Input() navMenuBtnTitleDisabled: string = '';

  /**
   * Flag que controla a visibilidade dos botões de perfil.
   *
   * @type {boolean}
   */
  @Input() hideButtonsProfile: boolean = false;

  /**
   * Evento emitido quando o botão inicial é clicado.
   *
   * @event
   */
  @Output() beginButtonClick = new EventEmitter<void>();

  /**
   * Manipula o evento de clique do botão inicial.
   * Emite um evento através do beginButtonClick.
   */
  onBeginClick() {
    this.beginButtonClick.emit();
  }
}
