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
  /**
   * Seleciona o menu inicial
   *
   * @memberof MainComponent
   * @type {string}
   * @default 'begin'
   */
  selectedMenu: string = 'begin';

  /**
   * Título exibido para a seção inicial.
   *
   * @memberof MainComponent
   * @type {EnvironmentMenuTitles}
   */
  beginTitle = EnvironmentMenuTitles.BEGIN;

  /**
   * Título exibido para a seção de aulas.
   *
   * @memberof MainComponent
   * @type {EnvironmentMenuTitles}
   */
  classesTitle = EnvironmentMenuTitles.CLASSES;

  /**
   * Título exibido para a seção de dados cadastrais.
   *
   * @memberof MainComponent
   * @type {EnvironmentMenuTitles}
   */
  registrationDataTitle = EnvironmentMenuTitles.REGISTRATION_DATA;

  /**
   * Título exibido para a seção de segurança.
   *
   * @memberof MainComponent
   * @type {EnvironmentMenuTitles}
   */
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

  /**
   * Título exibido para a seção desabilitada.
   *
   * @memberof MainComponent
   * @type {EnvironmentMenuTitles}
   */
  disabledTitle = EnvironmentMenuTitles.DISABLED;

  /**
   * aguardando voluntário
   *
   * @memberof MainComponent
   * @type {EnvironmentMenuTitles}
   */
  waitingVolunteerTitle = EnvironmentMenuTitles.WAITING_VOLUNTEER;

  /**
   * aguardando sua confirmação
   *
   * @memberof MainComponent
   * @type {EnvironmentMenuTitles}
   */
  waitingYourConfirmationTitle =
    EnvironmentMenuTitles.WAITING_YOUR_CONFIRMATION;

  /**
   * aulas agendadas
   *
   * @memberof MainComponent
   * @type {EnvironmentMenuTitles}
   */
  scheduledLessonsTitle = EnvironmentMenuTitles.SCHEDULED_LESSONS;

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
   * Indica se o modal de solicitação de aula está visível ou não.
   *
   * @memberof MainComponent
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

  /**
   * Cria uma instância do MainComponent.
   *
   * @param {AuthService} authService - Serviço de autenticação utilizado para gerenciar dados do usuário.
   * @memberof MainComponent
   */
  constructor(private authService: AuthService) {}

  /**
   * Método chamado ao inicializar o componente.
   * Carrega os dados do usuário ao iniciar o componente.
   *
   * @memberof MainComponent
   * Método do ciclo de vida do Angular executado após a criação do componente.
   * Inicializa o componente carregando os dados do usuário.
   *
   * @returns {Promise<void>} Uma promise que resolve quando os dados do usuário são carregados
   */
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

      // se o usuário possui username e role, preencho os campos com os dados do usuário
      if (userData && userData.username && userData.role) {
        this.userName = userData.username;
        this.userType = userData.role;
      } else {
        // se o usuário não possui username e role, preencho os campos com valores padrão
        console.warn('Dados do usuário incompletos ou inválidos');
        console.log('username:', userData?.username);
        console.log('role:', userData?.role);
        this.userName = 'Usuário';
        this.userType = 'Não definido';
      }
    } catch (error) {
      // se ocorrer um erro, preencho os campos com valores padrão
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

  /**
   * Fecha os menus abertos quando o botão de início é clicado
   *
   * @memberof MainComponent
   * @returns {void}
   */
  closeMenus() {
    this.menuOpen = false;
    this.showProfile = false;
  }

  /**
   * Retorna o título do primeiro botão baseado no tipo de usuário
   *
   * @memberof MainComponent
   * @returns {EnvironmentMenuTitles}
   */
  getButtonTitleOne(): EnvironmentMenuTitles {
    if (this.showProfile) {
      return this.securityTitle;
    }
    return this.userType === UserType.STUDENT
      ? this.waitingVolunteerTitle
      : this.scheduledTitle;
  }

  /**
   * Retorna o título do segundo botão baseado no tipo de usuário
   *
   * @memberof MainComponent
   * @returns {EnvironmentMenuTitles}
   */
  getButtonTitleTwo(): EnvironmentMenuTitles {
    if (this.showProfile) {
      return EnvironmentMenuTitles.NONE;
    }
    return this.userType === UserType.STUDENT
      ? this.waitingYourConfirmationTitle
      : this.tutoringRequestsTitle;
  }

  /**
   * Retorna o título do terceiro botão baseado no tipo de usuário
   *
   * @memberof MainComponent
   * @returns {EnvironmentMenuTitles}
   */
  getButtonTitleThree(): EnvironmentMenuTitles {
    if (this.showProfile) {
      return EnvironmentMenuTitles.NONE;
    }
    return this.userType === UserType.STUDENT
      ? this.scheduledLessonsTitle
      : this.pendingStudentConfirmationTitle;
  }

  /**
   * Método chamado quando um botão do menu é clicado
   * @param menuItem string identificando qual menu foi clicado
   */
  onMenuSelect(menuItem: string) {
    console.log('Menu selecionado:', menuItem);
    this.selectedMenu = menuItem;
    this.closeMenus();
  }

  /**
   * Verifica se deve mostrar o card manager
   * @returns {boolean}
   */
  shouldShowCardManager(): boolean {
    return this.selectedMenu === 'waiting_volunteer';
  }

  /**
   * Verifica se deve mostrar o botão de solicitar aula.
   *
   * Este método avalia se o usuário atual é um estudante, se o perfil do usuário não está visível
   * e se o menu selecionado não é o de "aguardando voluntário". Se todas essas condições forem
   * atendidas, o botão de solicitar aula será exibido.
   *
   * @returns {boolean}
   */
  shouldShowRequestButton(): boolean {
    return (
      this.isStudent() &&
      !this.showProfile &&
      this.selectedMenu !== 'waiting_volunteer'
    );
  }
}
