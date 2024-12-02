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
  @Output() buttonOneClick = new EventEmitter<void>();
  @Output() buttonTwoClick = new EventEmitter<void>();
  @Output() buttonThreeClick = new EventEmitter<void>();

  /**
   * Flag que controla o estado de abertura/fechamento do menu.
   *
   * @type {boolean}
   * @default false
   */
  isMenuOpen = false;

  /**
   * Flag que indica se a aplicação está sendo exibida em um dispositivo móvel.
   *
   * @type {boolean}
   * @default false
   */
  isMobile = false;

  @Input() showPersonalDataButton: boolean = false;
  @Input() navMenuBtnTitlePersonalData: string = '';
  @Output() personalDataButtonClick = new EventEmitter<void>();
  @Output() securityButtonClick = new EventEmitter<void>();

  /**
   * Manipula o evento de clique do botão inicial.
   * Emite um evento através do beginButtonClick.
   * @event {void} beginButtonClick - Evento emitido quando o botão inicial é clicado.
   */
  onBeginClick() {
    this.beginButtonClick.emit();
    this.isMenuOpen = false;
    this.isMobile = false;
  }

  /**
   * Manipula o evento de clique do primeiro botão do menu.
   * Emite um evento através do buttonOneClick.
   * @event {void} buttonOneClick - Evento emitido quando o primeiro botão é clicado.
   */
  onButtonOneClick(): void {
    this.buttonOneClick.emit();
  }

  /**
   * Manipula o evento de clique do segundo botão do menu.
   * Emite um evento através do buttonTwoClick.
   * @event {void} buttonTowClick - Evento emitido quando o segundo botão é clicado.
   */
  onButtonTwoClick(): void {
    this.buttonTwoClick.emit();
  }

  /**
   * Manipula o evento de clique do terceiro botão do menu.
   * Emite um evento através do buttonThreeClick.
   * @event {void} buttonThreeClick - Evento emitido quando o terceiro botão é clicado.
   */
  onButtonThreeClick(): void {
    this.buttonThreeClick.emit();
  }

  /**
   * Alterna o estado do menu.
   * @returns {void}
   */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Fecha o menu.
   * @returns {void}
   */
  closeMenu() {
    this.isMenuOpen = false;
  }

  /**
   * Manipula o clique do botão de Dados Pessoais
   */
  public onPersonalDataClick(): void {
    this.personalDataButtonClick.emit();
  }

  /**
   * Manipula o clique do botão de Segurança
   */
  public onSecurityClick(): void {
    this.securityButtonClick.emit();
  }
}
