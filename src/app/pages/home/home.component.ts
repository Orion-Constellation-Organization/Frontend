import { Component, ViewChild } from '@angular/core';
import { LoginComponent } from '../login/login.component';

/**
 * Componente responsável pela página home da aplicação.
 *
 * @component
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  /**
   * Título da página home.
   *
   * @type {string}
   */
  title = 'Reforca o bem';

  /**
   * Referência ao componente de login para controle do modal de autenticação.
   *
   * @type {LoginComponent}
   */
  @ViewChild('modalComponent') modalComponent!: LoginComponent;

  /**
   * Exibe o modal de login, configurando o estado de login no componente de login.
   * Se o componente de login não estiver disponível, exibe um erro no console.
   */
  showModal() {
    if (this.modalComponent) {
      this.modalComponent.loginStep = this.modalComponent.userState.login;
      this.modalComponent.toggle();
    } else {
      console.error('modalComponent não está disponível!');
    }
  }
}
