import { Component, OnInit } from '@angular/core';
import { EnvironmentMenuTitles } from 'src/utils/enum/environmentMenu.enum';
import { EnvironmentButton } from 'src/utils/enum/environmentButton';
import { AuthService } from 'src/shared/providers/auth.service';

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
export class MainComponent implements OnInit {
  /**
   * Título exibido para a seção de agendamentos.
   *
   * @type {string}
   */
  scheduledTitle = EnvironmentMenuTitles.SCHEDULED;

  /**
   * Título exibido para a seção de pedidos de tutoria.
   *
   * @type {string}
   */
  tutoringRequestsTitle = EnvironmentMenuTitles.TUTORING_REQUESTS;

  /**
   * Título exibido para a seção de aguardando confirmação do aluno.
   *
   * @type {string}
   */
  pendingStudentConfirmationTitle =
    EnvironmentMenuTitles.PENDING_STUDENT_CONFIRMATION;

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
   * Nome do usuário logado (tutor ou aluno)
   * @type {string}
   */
  userName = '';

  /**
   * Tipo do usuário logado
   * @type {string}
   */
  userType = '';

  /**
   * Título do botão
   * @type {string}
   */
  buttonTitle = EnvironmentButton.PRIMARY;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    await this.loadUserData();
  }

  /**
   * Carrega os dados do usuário do localStorage e atualiza o componente
   */
  private async loadUserData() {
    try {
      const userData = await this.authService.getCurrentUser();
      console.log('userData recebido:', userData);

      if (userData && userData.username && userData.role) {
        this.userName = userData.username;
        this.userType = userData.role;
      } else {
        console.warn('Dados do usuário incompletos ou inválidos');
        console.log('username:', userData?.username);
        console.log('role:', userData?.role);
        this.userName = 'Usuário';
        this.userType = 'Não definido';
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      this.userName = 'Usuário';
      this.userType = 'Não definido';
    }
  }

  /**
   * Alterna o estado de abertura do menu user.
   */
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
