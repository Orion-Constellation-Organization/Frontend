import {
  Component,
  Input,
  OnInit,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { AuthService } from 'src/shared/providers/auth.service';
import { UserType } from 'src/utils/enum/userType.enum';
import { StudentService } from 'src/shared/providers/student.service';
import { Reason, ReasonLabel } from 'src/utils/enum/reason.enum';
import { EnvironmentButton } from 'src/utils/enum/environmentButton.enum';
import { Observable } from 'rxjs';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { LessonRequestService } from 'src/shared/providers/lesson-request.service';
import { RegistrationSuccessModalComponent } from '../registration-success-modal/registration-success-modal.component';
/**
 * Componente para gerenciar cards de solicitações de aula.
 */
@Component({
  selector: 'app-lesson-card-manager',
  templateUrl: './lesson-card-manager.component.html',
  styleUrls: ['./lesson-card-manager.component.scss'],
})
export class LessonCardManagerComponent implements OnInit {
  /**
   * Nome do usuário.
   */
  @Input() public userName: string = '';

  /**
   * Nível de educação do usuário.
   */
  @Input() public educationLevel: string = '';

  /**
   * Solicitações de aula do usuário.
   */
  @Input() public lessonRequests: any[] = [];

  /**
   * Indica se o formulário de edição deve ser exibido.
   */
  public showEditForm = false;

  /**
   * Solicitação selecionada para edição.
   */
  public selectedRequest: any = null;

  /**
   * Mensagem de erro.
   */
  public errorMessage: string | null = null;

  /**
   * Mensagem que será exibida nas ações do modal.
   * @type {string}
   */
  @Input() message: string = '';

  /**
   * Flag que controla se o modal está aberto.
   * @type {boolean}
   */
  @Input() isOpen = false;

  /**
   * EventEmitter para fechar o modal.
   * @type {EventEmitter<string>}
   */
  @Output() closeModal = new EventEmitter<string>();

  /**
   * Referência ao componente do modal de sucesso.
   * Este componente é utilizado para exibir uma mensagem de sucesso após a realização de uma ação.
   * @type {RegistrationSuccessModalComponent}
   */
  @ViewChild(RegistrationSuccessModalComponent)
  registrationSuccessModal!: RegistrationSuccessModalComponent;

  /**
   * Armazena o ID da solicitação de aula que será excluída.
   * Este valor é definido quando o usuário clica no botão de exclusão
   * É usado durante o processo de confirmação de exclusão.
   *
   * @type {number | null}
   * @default null
   */
  public requestToDelete: number | null = null;

  /**
   * Controla a visibilidade dos botões de cancelar e excluir.
   * Exibe os botões no modal de sucesso quando o usuário clica no botão de exclusão.
   *
   * @type {boolean}
   * @default false
   */
  @Input() showDeleteButtons = false;

  /**
   * Controla a visibilidade do botão de fechar.
   *
   * @type {boolean}
   * @default true
   */
  @Input() showCloseButton = false;

  /** Indica se a requisição está em andamento */
  public isLoading: boolean = false;

  /**
   * Cria uma instância do componente LessonCardManager.
   * @param authService - Serviço de autenticação para gerenciar usuários.
   * @param studentService - Serviço para gerenciar dados de estudantes.
   * @param cdr - Referência ao ChangeDetectorRef para detectar mudanças no componente.
   */
  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private lessonRequestService: LessonRequestService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Método de ciclo de vida que é chamado após a inicialização do componente.
   * Carrega os dados do usuário logado.
   */
  public ngOnInit(): void {
    this.loadUserData();
  }

  /**
   * Retorna até três horários ou todos, se houver menos de três.
   * @param preferredDates - Datas preferidas.
   * @returns Horários disponíveis.
   */
  public getAvailableSchedules(preferredDates: string[]): string[] {
    return preferredDates.length > 3
      ? preferredDates.slice(0, 3)
      : preferredDates;
  }

  /**
   * Carrega os dados do usuário logado.
   * @returns Promise<void>
   */
  private async loadUserData(): Promise<void> {
    try {
      this.errorMessage = null;
      // obter os dados do usuário logado
      const userData = await this.authService.getCurrentUser();

      // obter o nome do usuário logado
      this.userName = userData?.username || 'Usuário não identificado';

      // depois, obtenho os dados completos do usuário
      if (userData?.role === UserType.STUDENT) {
        const studentData = await this.studentService.getStudentById(
          userData.id
        );

        // se o usuário é um estudante, obtenho o nível de educação individual
        if (studentData?.educationLevel?.levelType) {
          this.educationLevel = studentData.educationLevel.levelType;
        } else {
          this.educationLevel = 'Não definido';
        }

        // Mapear as solicitações de aula para o formato do card
        this.lessonRequests = studentData.lessonRequests.map((request: any) =>
          this.mapLessonRequest(request, studentData)
        );
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário', error);
      this.errorMessage = 'Erro ao carregar dados do usuário';
    }
  }

  /**
   * Mapeia uma solicitação de aula para o formato do card.
   * @param request - A solicitação de aula a ser mapeada.
   * @param studentData - Os dados do estudante relacionados à solicitação.
   * @returns Um objeto contendo os dados formatados da solicitação de aula.
   */
  private mapLessonRequest(request: any, studentData: any) {
    const requestId = request.ClassId;

    if (!requestId) {
      console.warn('Solicitação sem ID:', request);
    }

    // Formatar todos os horários disponíveis
    const formattedSchedules = Array.isArray(request.preferredDates)
      ? request.preferredDates
          .filter(Boolean)
          .map(this.formatSchedule)
          .filter(Boolean)
      : [];

    return {
      classId: requestId,
      userName: studentData.username,
      educationLevel: studentData.educationLevel.levelType,
      subject: request.subject.subjectName || 'Erro ao obter a disciplina',
      reasonType: request.reason
        .map((r: string) => ReasonLabel[r as Reason] || r)
        .join(', '),
      tutorDescription: request.additionalInfo || 'Sem informações adicionais',
      availableSchedules: this.getAvailableSchedules(formattedSchedules),
      subjectId: request.subject.subjectId,
      studentId: studentData.id,
    };
  }

  /**
   * Função auxiliar para formatar a data.
   * @param dateString - A string da data a ser formatada.
   * @returns A data formatada ou uma mensagem de erro.
   */
  private formatSchedule = (dateString: string): string => {
    try {
      if (!dateString) return 'Ocorreu um erro ao formatar a data';

      // Se já estiver no formato de exibição, retorna como está
      if (dateString.includes(' às ')) {
        return dateString;
      }

      // Parse da data no novo formato YYYY-MM-DDThh:mm
      const [datePart, timePart] = dateString.split('T');
      const date = new Date(datePart);

      if (isNaN(date.getTime())) {
        console.warn('Data inválida:', dateString);
        return 'Ocorreu um erro ao formatar a data';
      }

      // Formatar a data para dd/MM/yyyy
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();

      // Formatar a hora (assumindo que timePart está em formato HH:mm)
      const formattedTime = timePart ? timePart.substring(0, 5) : '00:00';

      // Retorna no formato de exibição dd/MM/yyyy às HH:mm
      return `${day}/${month}/${year} às ${formattedTime}`;
    } catch (error) {
      console.error('Erro ao formatar data:', dateString, error);
      return 'Ocorreu um erro ao formatar a data';
    }
  };

  /**
   * Manipula o clique no botão de edição.
   * Este método verifica se a solicitação possui um ID válido antes de abrir o formulário de edição.
   * Se um formulário de edição já estiver aberto, ele será fechado antes de abrir o novo.
   * @param request - Solicitação a ser editada.
   */
  public onEditClick(request: any): void {
    if (!request.classId) {
      console.error('Tentativa de edição sem ID da solicitação:', request);
      this.errorMessage = 'Tentativa de edição sem ID da solicitação';
      return;
    }
    // Fechar qualquer modal aberto anteriormente
    if (this.showEditForm) {
      this.closeEditForm().subscribe(() => {
        this.openEditForm(request);
      });
    } else {
      this.openEditForm(request);
    }
  }

  /**
   * Manipula o clique no botão de deletar uma solicitação de aula.
   *
   * Este método realiza as seguintes operações:
   * 1. Valida se o ID da solicitação é válido.
   * 2. Define a mensagem de confirmação para o usuário.
   * 3. Exibe os botões de cancelar e excluir.
   * 4. Abre o modal de sucesso para confirmação da exclusão.
   *
   * @param classId - O identificador único da solicitação de aula a ser deletada.
   * @throws {Error} Se houver falha na comunicação com o servidor.
   * @returns Promise que resolve quando a operação é concluída com sucesso.
   */
  public async onDeleteClick(classId: number): Promise<void> {
    this.isLoading = true;
    try {
      this.requestToDelete = classId;
      this.message =
        'Ao clicar em excluir, o pedido será apagado do sistema. Não poderá dar andamento para o agendamento, somente fazendo um novo pedido de aula.';
      this.showCloseButton = false;
      this.showDeleteButtons = true;
      this.openRegistrationSuccessDialog();
    } catch (error) {
      console.error('Erro ao deletar solicitação:', error);
      this.errorMessage = 'Erro ao deletar a solicitação';
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Manipula a confirmação da exclusão de uma solicitação de aula.
   * Este método realiza as seguintes operações:
   * 1. Verifica se o ID da solicitação a ser deletada está definido.
   * 2. Chama o serviço para deletar a solicitação.
   * 3. Recarrega os dados do usuário após a exclusão.
   * 4. Trata erros que possam ocorrer durante o processo de exclusão.
   * 5. Limpa o ID da solicitação após a exclusão.
   * 6. Exibe mensagens de erro caso ocorram falhas na comunicação com o servidor.
   *
   * @returns Promise<void> - Uma promessa que resolve quando a operação de exclusão é concluída.
   */
  public async handleConfirmDelete(): Promise<void> {
    this.isLoading = true;
    try {
      if (!this.requestToDelete) {
        console.error('ID da solicitação não encontrado');
        this.errorMessage = 'ID da solicitação não encontrado';
        return;
      }

      await this.lessonRequestService.deleteLessonRequest(this.requestToDelete);
      this.requestToDelete = null;

      // Recarrega os dados após deletar
      await this.loadUserData();
    } catch (error) {
      console.error('Erro ao deletar solicitação:', error);
      this.errorMessage = 'Erro ao deletar a solicitação';
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Abre o formulário de edição.
   * @param request - Solicitação a ser editada.
   */
  private openEditForm(request: any): void {
    try {
      if (!request) {
        console.error('Request inválido:', request);
        return;
      }

      // Garantir que todos os campos necessários existam
      this.selectedRequest = {
        classId: request.classId,
        userName: request.userName || 'Usuário não identificado',
        educationLevel: request.educationLevel || 'Nível não definido',
        subject: request.subject || 'Sem matéria definida',
        reasonType: request.reasonType || '',
        tutorDescription: request.tutorDescription || '',
        availableSchedules: Array.isArray(request.availableSchedules)
          ? request.availableSchedules.filter(Boolean)
          : [],
        subjectId: request.subjectId,
      };

      this.showEditForm = true;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Erro ao preparar dados para edição:', error);
    }
  }

  /**
 Fecha o formulário de edição e emite um evento quando a operação é concluída.
   * Este método também atualiza os dados do usuário se o resultado da edição for 'updated'.
   * @param result - Resultado da edição.
   */
  public onCloseForm(result?: string): void {
    this.showEditForm = false;
    this.selectedRequest = null;
    this.cdr.detectChanges();

    if (result === 'updated') {
      timer(100)
        .pipe(take(1))
        .subscribe(() => {
          this.loadUserData();
        });
    }
  }

  /**
   * Obtém os tipos de botões disponíveis para edição e exclusão.
   * @returns Um objeto contendo os tipos de botões de edição e exclusão.
   */
  public get buttonTypes() {
    const { EDIT, DELETE } = EnvironmentButton;
    return {
      editRequest: EDIT,
      deleteRequest: DELETE,
    };
  }

  /**
   * Fecha o formulário de edição e emite um evento quando a operação é concluída.
   * @returns Um Observable que emite um valor quando o formulário é fechado.
   */
  private closeEditForm(): Observable<void> {
    return new Observable<void>((observer) => {
      this.showEditForm = false;
      this.selectedRequest = null;
      this.cdr.detectChanges();
      observer.next();
      observer.complete();
    });
  }

  /**
   * Abre o modal ao definir `isOpen` como `true`.
   * @public
   */
  public openRegistrationSuccessDialog(): void {
    this.registrationSuccessModal.isOpen = true;
  }

  /**
   * Fecha o modal ao definir `isOpen` como `false`
   * Emite o evento `closeModal` para informar o fechamento.
   * @public
   */
  public closeRegistrationSuccessDialog(): void {
    this.registrationSuccessModal.isOpen = false;
    this.closeModal.emit();
  }
}
