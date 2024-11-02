import { Component } from '@angular/core';

/**
 * Componente principal da aplicação que gerencia o estado do menu e os títulos exibidos.
 *
 * @component
 */
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  /**
   * Título exibido para a seção de agendamentos.
   *
   * @type {string}
   */
  titleOne = 'Agendadas';

  /**
   * Título exibido para a seção de pedidos de tutoria.
   *
   * @type {string}
   */
  titleTwo = 'Pedidos de Tutoria';

  /**
   * Título exibido para a seção de aguardando confirmação do aluno.
   *
   * @type {string}
   */
  titleThree = 'Aguardando confirmação do Aluno';

  /**
   * Nome do tutor atualmente em uso.
   *
   * @type {string}
   */
  tutor = 'fulano';

  /**
   * Indica se o menu user está aberto ou fechado.
   *
   * @type {boolean}
   */
  menuOpen = false;

  /**
   * Alterna o estado de abertura do menu user.
   */
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
