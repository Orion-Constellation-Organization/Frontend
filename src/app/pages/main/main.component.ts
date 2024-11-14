import { Component, OnInit } from '@angular/core';
import { EnvironmentMenuTitles } from 'src/utils/enum/environmentMenu.enum';
import { EnvironmentButton } from 'src/utils/enum/environmentButton.enum';
import { AuthService } from 'src/shared/providers/auth.service';
import { UserType } from 'src/utils/enum/userType.enum';

/**
 * Componente principal da aplicação que gerencia o estado do menu e os títulos exibidos.
 *
 * @export
 * @class MainComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  beginTitle = EnvironmentMenuTitles.BEGIN;
  classesTitle = EnvironmentMenuTitles.CLASSES;
  registrationDataTitle = EnvironmentMenuTitles.REGISTRATION_DATA;
  securityTitle = EnvironmentMenuTitles.SECURITY;
  /**
   * Título exibido para a seção de agendamentos.
   *
   * @memberof MainComponent
   * @type {EnvironmentMenuTitles}
   */
  scheduledTitle = EnvironmentMenuTitles.SCHEDULED;

  /**
   * Título exibido para a seção de pedidos de tutoria.
   *
   * @memberof MainComponent
   * @type {EnvironmentMenuTitles}
   */
  tutoringRequestsTitle = EnvironmentMenuTitles.TUTORING_REQUESTS;

  /**
   * Título exibido para a seção de aguardando confirmação do aluno.
   *
   * @memberof MainComponent
   * @type {EnvironmentMenuTitles}
   */
  pendingStudentConfirmationTitle =
    EnvironmentMenuTitles.PENDING_STUDENT_CONFIRMATION;

  disabledTitle = EnvironmentMenuTitles.DISABLED;

  /**
   * Nome do tutor atualmente em uso.
   *
   * @memberof MainComponent
   * @type {string}
   */
  tutor = 'fulano';

  /**
   * Indica se o menu user está aberto ou fechado.
   *
   * @memberof MainComponent
   * @type {boolean}
   */
  menuOpen = false;

  /**
   * Nome do usuário logado
   *
   * @memberof MainComponent
   * @type {string}
   * @default ''
   */
  userName = '';

  /**
   * Tipo do usuário logado
   *
   * @memberof MainComponent
   * @type {UserType | string}
   * @default ''
   */
  userType = '';

  /**
   * Título do botão
   * @type {EnvironmentButton}
   */
  buttonTitle: EnvironmentButton = EnvironmentButton.PRIMARY;

  /**
   * Controla a visibilidade do modal de solicitação de aula
   *
   * @type {boolean}
   * @default false
   */
  showClassRequestModal = false;

  /**
   * Controla a visibilidade do modal de perfil do usuário
   *
   * @type {boolean}
   * @default false
   */
  showProfile = false;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    await this.loadUserData();
  }

  /**
   * Carrega os dados do usuário do localStorage e atualiza o componente
   *
   * @private
   * @memberof MainComponent
   * @returns {Promise<void>}
   * @throws {Error} Quando houver falha ao carregar os dados do usuário
   */
  private async loadUserData(): Promise<void> {
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
   *
   * @memberof MainComponent
   * @returns {void}
   */
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * Alterna a visibilidade do modal de perfil do usuário
   *
   * @memberof MainComponent
   * @returns {void}
   */
  toggleProfile() {
    this.showProfile = !this.showProfile;
    this.toggleMenu();
  }

  /**
   * Verifica se o usuário é um estudante
   *
   * @memberof MainComponent
   * @returns {boolean} Retorna true se o usuário for um estudante, false caso contrário
   */
  isStudent(): boolean {
    return this.userType === UserType.STUDENT;
  }

  /**
   * Verifica se o usuário é um tutor
   *
   * @memberof MainComponent
   * @returns {boolean}
   */
  isTutor(): boolean {
    return this.userType === UserType.TUTOR;
  }

  /**
   * Alterna a visibilidade do modal de solicitação de aula
   *
   * @memberof MainComponent
   * @returns {void}
   */
  toggleClassRequestModal() {
    this.showClassRequestModal = !this.showClassRequestModal;
  }
}
