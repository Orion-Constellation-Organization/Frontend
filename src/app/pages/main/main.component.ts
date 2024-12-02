import { Component, OnInit } from '@angular/core';
import { EnvironmentMenuTitles } from 'src/utils/enum/environmentMenu.enum';
import { EnvironmentButton } from 'src/utils/enum/environmentButton.enum';
import { AuthService } from 'src/shared/providers/auth.service';
import { UserType } from 'src/utils/enum/userType.enum';
import { SelectedMenu } from 'src/utils/enum/selectedMenu.enum';
import { TutorService } from 'src/shared/providers/tutor.service';

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
   * Seleciona o tipo de menu
   *
   * Este campo determina qual menu será exibido inicialmente na aplicação.
   * O valor padrão é 'begin', mas pode ser alterado para outros tipos de menus conforme necessário.
   *
   * @memberof MainComponent
   * @type {SelectedMenu}
   * @default SelectedMenu.BEGIN
   */
  selectedMenu: SelectedMenu =
    SelectedMenu.BEGIN ||
    SelectedMenu.CLASSES_SCHEDULED ||
    SelectedMenu.WAITING_VOLUNTEER;

  /**
   * Título exibido para a seção inicial.
   *
   * @memberof MainComponent
   * @type {EnvironmentMenuTitles}
   */
  beginTitle = EnvironmentMenuTitles.BEGIN;

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

  tutorHasSubjects: boolean = false;
  showPersonalData = false;
  showSecurity = false;

  /**
   * Cria uma instância do MainComponent.
   *
   * @param {AuthService} authService - Serviço de autenticação utilizado para gerenciar dados do usuário.
   * @memberof MainComponent
   */
  constructor(
    private authService: AuthService,
    private tutorService: TutorService
  ) {}

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

    if (this.isTutor()) {
      this.selectedMenu = SelectedMenu.TUTOR_BEGIN;
    }
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

        if (this.isTutor()) {
          const tutorData = await this.tutorService.getTutorById(userData.id);
          this.tutorHasSubjects = tutorData.subjects && tutorData.subjects.length > 0;
        }
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
    
    if (!this.showProfile) {
      this.showPersonalData = false;
      this.showSecurity = false;
    }
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
   * Obtém o título das classes baseado na visibilidade do perfil do usuário.
   *
   * Este método verifica se o perfil do usuário está visível. Se estiver, retorna o título
   * da seção de dados cadastrais. Caso contrário, retorna o título da seção de aulas.
   *
   * @returns {EnvironmentMenuTitles} - O título das classes, que pode ser um dos títulos definidos
   * na enumeração EnvironmentMenuTitles.
   */
  private getButtonTitleClasses(): EnvironmentMenuTitles {
    if (this.showProfile) {
      return EnvironmentMenuTitles.REGISTRATION_DATA;
    }
    return EnvironmentMenuTitles.CLASSES;
  }

  /**
   * Obtém o título das classes baseado na visibilidade do perfil do usuário.
   *
   * Este método retorna o título das classes dependendo se o perfil do usuário está visível ou não.
   * Se o perfil estiver visível, retorna o título da seção de dados cadastrais.
   * Caso contrário, chama o método `getButtonTitleClasses()` para determinar o título apropriado.
   *
   * @returns {string} - O título das classes, que pode ser um dos títulos definidos
   * na enumeração EnvironmentMenuTitles.
   */
  public get buttonTitleClasses(): string {
    return !this.showProfile
      ? this.getButtonTitleClasses()
      : EnvironmentMenuTitles.REGISTRATION_DATA;
  }

  /**
   * Retorna o título do primeiro botão baseado no tipo de usuário.
   *
   * Este método verifica se o perfil do usuário está visível. Se estiver, retorna o título de segurança.
   * Caso contrário, retorna o título apropriado com base no tipo de usuário:
   * se o usuário for um estudante, retorna o título de "Aguardando Voluntário";
   * caso contrário, retorna o título de "Agendado".
   *
   * @memberof MainComponent
   * @returns {EnvironmentMenuTitles} - O título do primeiro botão, que pode ser um dos títulos definidos
   * na enumeração EnvironmentMenuTitles.
   */
  private getButtonTitleOne(): EnvironmentMenuTitles {
    if (this.showProfile) {
      return EnvironmentMenuTitles.SECURITY;
    }
    return this.userType === UserType.STUDENT
      ? EnvironmentMenuTitles.WAITING_VOLUNTEER
      : EnvironmentMenuTitles.SCHEDULED;
  }

  /**
   * Obtém o título do primeiro botão baseado na visibilidade do perfil do usuário.
   *
   * Este método retorna o título do botão dependendo se o perfil do usuário está visível ou não.
   * Se o perfil estiver visível, retorna o título de segurança; caso contrário, chama o método
   * `getButtonTitleOne()` para determinar o título apropriado.
   *
   * @returns {string} O título do primeiro botão ou o título de segurança se o perfil estiver visível.
   */
  public get buttonTitleOne(): string {
    return !this.showProfile
      ? this.getButtonTitleOne()
      : EnvironmentMenuTitles.SECURITY;
  }

  /**
   * Retorna o título do segundo botão baseado no tipo de usuário.
   *
   * Este método verifica se o perfil do usuário está visível. Se estiver, retorna um valor padrão
   * indicando que nenhum título deve ser exibido. Caso contrário, retorna o título apropriado com base
   * no tipo de usuário: se o usuário for um estudante, retorna o título de "Aguardando Sua Confirmação";
   * caso contrário, retorna o título de "Pedidos de Tutoria".
   *
   * @memberof MainComponent
   * @returns {EnvironmentMenuTitles} - O título do segundo botão, que pode ser um dos títulos definidos
   * na enumeração EnvironmentMenuTitles.
   */
  private getButtonTitleTwo(): EnvironmentMenuTitles {
    if (this.showProfile) {
      return EnvironmentMenuTitles.PERSONAL_DATA;
    }
    return this.userType === UserType.STUDENT
      ? EnvironmentMenuTitles.WAITING_YOUR_CONFIRMATION
      : EnvironmentMenuTitles.TUTORING_REQUESTS;
  }

  /**
   * Obtém o título do segundo botão baseado na visibilidade do perfil do usuário.
   *
   * Este método retorna uma string que representa o título do segundo botão.
   * Se o perfil do usuário não estiver visível, chama o método `getButtonTitleTwo()`
   * para determinar o título apropriado. Caso contrário, retorna uma string vazia.
   *
   * @returns {string} O título do segundo botão ou uma string vazia se o perfil estiver visível.
   */
  public get buttonTitleTwo(): string {
    return !this.showProfile 
      ? this.getButtonTitleTwo()
      : EnvironmentMenuTitles.PERSONAL_DATA;
  }

  /**
   * Retorna o título do terceiro botão baseado no tipo de usuário.
   *
   * Este método verifica se o perfil do usuário está visível. Se estiver, retorna um valor padrão
   * indicando que nenhum título deve ser exibido. Caso contrário, retorna o título apropriado com base
   * no tipo de usuário: se o usuário for um estudante, retorna o título de "Aulas Agendadas";
   * caso contrário, retorna o título de "Aguardando Confirmação do Aluno".
   *
   * @memberof MainComponent
   * @returns {EnvironmentMenuTitles} - O título do terceiro botão, que pode ser um dos títulos definidos
   * na enumeração EnvironmentMenuTitles.
   */
  private getButtonTitleThree(): EnvironmentMenuTitles {
    if (this.showProfile) {
      return EnvironmentMenuTitles.NONE;
    }
    return this.userType === UserType.STUDENT
      ? EnvironmentMenuTitles.SCHEDULED_LESSONS
      : EnvironmentMenuTitles.PENDING_STUDENT_CONFIRMATION;
  }

  /**
   * Obtém o título do terceiro botão baseado na visibilidade do perfil do usuário.
   *
   * Este método retorna uma string que representa o título do terceiro botão.
   * Se o perfil do usuário não estiver visível, chama o método `getButtonTitleThree()`
   * para determinar o título apropriado. Caso contrário, retorna uma string vazia.
   *
   * @returns {string} O título do terceiro botão ou uma string vazia se o perfil estiver visível.
   */
  public get buttonTitleThree(): string {
    return !this.showProfile ? this.getButtonTitleThree() : '';
  }

  /**
   * Obtém o título do botão desabilitado baseado na visibilidade do perfil do usuário.
   *
   * Este método retorna o título do botão desabilitado dependendo se o perfil do usuário está visível ou não.
   * Se o perfil estiver visível, retorna uma string vazia; caso contrário, retorna uma string vazia. Nesse caso, ambos títulos estão vazios.
   *
   * @returns {EnvironmentMenuTitles} - O título do botão desabilitado, que pode ser um dos títulos definidos
   * na enumeração EnvironmentMenuTitles.
   */
  private getButtonTitleDisabled(): EnvironmentMenuTitles {
    if (this.showProfile) {
      return EnvironmentMenuTitles.NONE;
    }
    return EnvironmentMenuTitles.DISABLED;
  }

  /**
   * Obtém o título do botão desabilitado baseado na visibilidade do perfil do usuário.
   *
   * Este método retorna uma string que representa o título do botão desabilitado.
   * Se o perfil do usuário não estiver visível, retorna uma string vazia.
   * Caso contrário, retorna uma string vazia. Nesse caso, ambos títulos estão vazios.
   *
   * @returns {string} O título do botão desabilitado ou uma string vazia se o perfil estiver visível.
   */
  public get buttonTitleDisabled(): string {
    return !this.showProfile ? this.getButtonTitleDisabled() : '';
  }

  /**
   * Método chamado quando um botão do menu é clicado
   *
   * Este método atualiza o menu selecionado e fecha os menus abertos.
   *
   * @param menuItem string identificando qual menu foi clicado
   * @returns {void} - Não retorna nenhum valor.
   */
  public onMenuSelect(menuItem: string) {
    this.selectedMenu = menuItem as SelectedMenu;
    this.closeMenus();
  }

  /**
   * Mostra um componente dependendo do tipo de usuário e qual botão foi selecionado
   * @param componentType O tipo do componente a ser verificado
   * @returns Retorna 'true' se o componente correspondente deve ser exibido, 'false' caso contrário
   */
  public shouldShowComponent(componentType: string): boolean {
    if (this.isStudent()) {
      switch (componentType) {
        case 'begin':
          return this.selectedMenu === SelectedMenu.BEGIN && !this.showProfile;
        case 'first':
          return this.selectedMenu === SelectedMenu.WAITING_VOLUNTEER && !this.showProfile;
        case 'second':
          return this.selectedMenu === SelectedMenu.WAITING_CONFIRMATION && !this.showProfile;
        case 'third':
          return this.selectedMenu === SelectedMenu.CLASSES_SCHEDULED && !this.showProfile;
        default:
          return false;
      }
    } else if (this.isTutor()) {
      switch (componentType) {
        case 'begin':
          return this.selectedMenu === SelectedMenu.TUTOR_BEGIN && !this.showProfile;
        case 'first':
          return this.selectedMenu === SelectedMenu.TUTOR_SCHEDULED && !this.showProfile;
        case 'second':
          return this.selectedMenu === SelectedMenu.TUTOR_REQUEST && !this.showProfile;
        case 'third':
          return this.selectedMenu === SelectedMenu.TUTOR_WAITING_CONFIRMATION && !this.showProfile;
        default:
          return false;
      }
    }
    return false;
  }

  /**
   * Verifica se deve mostrar o botão de solicitar aula.
   *
   * Este método avalia se o usuário atual é um estudante, se o perfil do usuário não está visível
   * e se o menu selecionado não é o de "aguardando voluntário".
   *
   * @returns {boolean} - Se a condição for verdadeira, o botão de solicitar aula será exibido.
   */
  public shouldShowRequestButton(): boolean {
    return (
      this.isStudent() &&
      !this.showProfile &&
      this.selectedMenu !== SelectedMenu.WAITING_VOLUNTEER
    );
  }

  /**
   * Manipula o clique do botão de início e executa a ação associada
   */
  public handleBeginButtonClick(): void {
    if (this.isStudent()) {
      this.onMenuSelect(SelectedMenu.BEGIN);
    } else {
      this.onMenuSelect(SelectedMenu.TUTOR_BEGIN);
    }
  }

  /**
   * Manipula o clique do primeiro botão e executa a ação associada
   */
  public handleFirstButtonClick(): void {
    if (this.isStudent()) {
      this.onMenuSelect(SelectedMenu.WAITING_VOLUNTEER);
    } else {
      this.onMenuSelect(SelectedMenu.TUTOR_SCHEDULED);
    }
  }

  /**
   * Manipula o clique do segundo botão e executa a ação associada
   */
  public handleSecondButtonClick(): void {
    if (this.isStudent()) {
      this.onMenuSelect(SelectedMenu.WAITING_CONFIRMATION);
    } else {
      this.onMenuSelect(SelectedMenu.TUTOR_REQUEST);
    }
  }

  /**
   * Manipula o clique do terceiro botão e executa a ação associada
   */
  public handleThirdButtonClick(): void {
    if (this.isStudent()) {
      this.onMenuSelect(SelectedMenu.CLASSES_SCHEDULED);
    } else {
      this.onMenuSelect(SelectedMenu.TUTOR_WAITING_CONFIRMATION);
    }
  }

  /**
   * Método para verificar se deve mostrar o botão de Dados Pessoais
   * @returns 'true' se o usuário for um tutor e estiver na área de perfil, 'false' caso contrário
   */
  public showPersonalDataButton(): boolean {
    return this.isTutor() && this.showProfile;
  }

  /**
   * Mostra o componente para os Dados Pessoais e não mostra o de Dados Cadastrais
   */
  public togglePersonalData(): void {
    this.showPersonalData = true;
    this.showSecurity = false;
  }

  /**
   * Mostra o componente para os Dados Cadastrais e não mostra o de Dados Pessoais
   */
  public toggleSecurity(): void {
    this.showPersonalData = false;
    this.showSecurity = true;
  }
}
