import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  ViewChild,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { EnvironmentButton } from 'src/utils/enum/environmentButton.enum';
import { Reason, ReasonLabel } from 'src/utils/enum/reason.enum';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ClassRequestService } from '../../providers/class-request.service';
import { AuthService } from '../../providers/auth.service';
import { IClassRequest } from '../../interfaces/class-request.interface';
import { formatDate } from '@angular/common';
import { SubjectService } from '../../providers/subject.service';
import { ISubject } from '../../interfaces/subject.interface';
import { RegistrationSuccessModalComponent } from '../registration-success-modal/registration-success-modal.component';
import { LessonRequestService } from '../../providers/lesson-request.service';

/**
 * Componente responsável pelo formulário de solicitação de aulas.
 * Gerencia a criação, validação e submissão de pedidos de aulas.
 */
@Component({
  selector: 'app-class-request-form',
  templateUrl: './class-request-form.component.html',
  styleUrls: ['./class-request-form.component.scss'],
})
export class ClassRequestFormComponent implements OnInit {
  /**
   * Flag que controla se o modal está aberto.
   * @type {boolean}
   */
  @Input() isOpen = false;
  /**
   * Mensagem que será exibida no modal de sucesso após o envio do pedido de aula.
   * @type {string}
   */
  @Input() message: string = 'Seu pedido de aula foi enviado com sucesso!';
  /**
   * EventEmitter para fechar o modal.
   * @type {EventEmitter<string>}
   */
  @Output() closeModal = new EventEmitter<string>();
  /**
   * Indica se o componente está em modo de edição.
   * @type {boolean}
   */
  @Input() editMode = false;
  /**
   * Dados da solicitação a serem editados, se disponíveis.
   * @type {any}
   */
  @Input() requestData: any = null;

  /** Formulário principal de solicitação de aulas */
  classRequestForm: FormGroup;
  /** Lista de opções de motivos para a solicitação */
  reasonOptions = Object.values(Reason).map((reason) => ({
    value: reason,
    label: ReasonLabel[reason],
  }));

  /**
   * Lista de matérias disponíveis para seleção
   * Carregada durante a inicialização do componente
   */
  subjects: ISubject[] = [];

  /** Enum de botões de ambiente */
  EnvironmentButton = EnvironmentButton;

  /** Referência ao componente do modal de sucesso */
  @ViewChild(RegistrationSuccessModalComponent)
  registrationSuccessModal!: RegistrationSuccessModalComponent;

  /**
   * Mensagem de erro exibida quando ocorre algum problema na submissão
   * @type {string}
   */
  errorMessage: string = '';

  /**
   * Horário conflitante identificado durante a validação
   * @type {string}
   */
  conflictingSchedule: string = '';

  /**
   * Indica se existe um erro relacionado aos horários selecionados
   * @type {boolean}
   */
  hasScheduleError: boolean = false;

  /** Indica se o formulário foi modificado */
  isFormModified: boolean = false;

  /**
   * Construtor do componente
   * @param fb - Serviço FormBuilder para criação de formulários reativos
   * @param classRequestService - Serviço para gerenciar solicitações de aulas
   * @param authService - Serviço de autenticação
   * @param subjectService - Serviço para gerenciar matérias
   * @param lessonRequestService - Serviço para gerenciar solicitações de aulas
   * @param cdr - ChangeDetectorRef para detectar mudanças no formulário
   */
  constructor(
    private fb: FormBuilder,
    private classRequestService: ClassRequestService,
    private lessonRequestService: LessonRequestService,
    private authService: AuthService,
    private subjectService: SubjectService,
    private cdr: ChangeDetectorRef
  ) {
    this.classRequestForm = this.fb.group({
      reasons: this.fb.array([], [Validators.required]),
      schedules: this.fb.array(
        [this.createScheduleControl()],
        [Validators.required]
      ),
      subjectId: ['', Validators.required],
      additionalInfo: [''],
    });
  }

  /**
   * Inicializa o componente carregando a lista de matérias disponíveis
   */
  async ngOnInit() {
    try {
      // Primeiro, garantir que o serviço de matérias está disponível
      if (!this.subjectService) {
        throw new Error('SubjectService não está disponível');
      }

      // Carregar as matérias com tratamento de erro adequado
      const subjects = await this.subjectService.getSubjects();

      if (!Array.isArray(subjects)) {
        throw new Error('Resposta inválida do serviço de matérias');
      }

      this.subjects = subjects.filter(
        (subject) =>
          subject &&
          typeof subject === 'object' &&
          'subjectId' in subject &&
          'subjectName' in subject
      );

      // Resto da lógica de inicialização
      if (this.editMode && this.requestData) {
        await this.populateFormWithExistingData();
      }
    } catch (error) {
      console.error('Erro ao carregar matérias:', error);
      // Inicializar com array vazio para evitar erros de renderização
      this.subjects = [];
    }

    // Adicionar observador de mudanças no formulário
    this.classRequestForm.valueChanges.subscribe(() => {
      this.validateForm();
      this.isFormModified = true;
    });
  }

  /**
   * Popula o formulário com dados existentes, se disponíveis.
   *
   * Este método verifica se os dados da solicitação estão disponíveis e, em caso afirmativo,
   * limpa o formulário atual e preenche os campos de razões e horários com os dados fornecidos.
   *
   * @throws {Error} Se os dados da solicitação não estiverem disponíveis ou se ocorrer um erro ao processar os dados.
   *
   * @returns {Promise<void>} Uma promessa que resolve quando a operação de preenchimento é concluída.
   *
   * @private
   */
  private async populateFormWithExistingData(): Promise<void> {
    try {
      if (!this.requestData || !this.requestData.availableSchedules) {
        console.warn('Dados inválidos ou ausentes:', this.requestData);
        return;
      }

      // Limpar o formulário antes de popular
      this.classRequestForm.reset();

      // Populando o FormArray de razões
      const reasonsArray = this.classRequestForm.get('reasons') as FormArray;
      while (reasonsArray.length) {
        reasonsArray.removeAt(0);
      }

      // Processar razões
      if (this.requestData.reasonType) {
        const reasonLabels = this.requestData.reasonType
          .split(', ')
          .filter(Boolean);
        reasonLabels.forEach((label: string) => {
          const reasonEntry = Object.entries(ReasonLabel).find(
            ([_, value]) => value === label
          );
          if (reasonEntry) {
            reasonsArray.push(this.fb.control(reasonEntry[0]));
          }
        });
      }

      // Populando o FormArray de horários
      const schedulesArray = this.schedules;
      while (schedulesArray.length) {
        schedulesArray.removeAt(0);
      }

      // Processar horários
      if (Array.isArray(this.requestData.availableSchedules)) {
        this.requestData.availableSchedules.forEach((schedule: string) => {
          if (!schedule || !schedule.includes(' às ')) {
            console.warn(
              'Horário inválido encontrado ou formato incorreto:',
              schedule
            );
            return;
          }

          const [datePart, timePart] = schedule
            .split(' às ')
            .map((part) => part?.trim());
          const [day, month, year] = datePart.split('/').map(Number);
          const date = new Date(year, month - 1, day);

          if (isNaN(date.getTime()) || !day || !month || !year) {
            console.warn('Data inválida encontrada:', datePart);
            return;
          }

          schedulesArray.push(
            this.fb.group({ date: [date], time: [timePart] })
          );
        });
      }

      // Populando os campos de subjectId e additionalInfo
      if (this.requestData.subjectId) {
        this.classRequestForm.patchValue({
          subjectId: this.requestData.subjectId,
          additionalInfo: this.requestData.tutorDescription || '',
        });
      }
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Erro ao popular formulário:', error);
      this.errorMessage = 'Erro ao carregar os dados do pedido.';
    }
  }

  /**
   * Cria um novo grupo de controles para agendamento
   * @returns FormGroup com controles de data e hora
   */
  private createScheduleControl() {
    return this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
    });
  }

  /**
   * Getter que retorna o FormArray de agendamentos do formulário
   * @returns {FormArray} Array de controles de agendamento
   */
  get schedules() {
    return this.classRequestForm.get('schedules') as FormArray;
  }

  /**
   * Verifica se é possível adicionar mais horários ao formulário
   * @returns {boolean} true se podem ser adicionados mais horários (máximo 3)
   */
  addSchedule() {
    if (this.schedules.length < 3) {
      this.schedules.push(this.createScheduleControl());
    }
  }

  /**
   * Verifica se é possível adicionar mais horários
   * @returns boolean indicando se podem ser adicionados mais horários
   */
  get canAddMoreSchedules(): boolean {
    return this.schedules.length < 3;
  }

  /**
   * Remove um agendamento específico do formulário
   * @param {number} index - Índice do agendamento a ser removido
   */
  removeSchedule(index: number) {
    this.schedules.removeAt(index);
  }

  /**
   * Manipula a mudança nos checkboxes de motivos
   * @param {Reason} reason - Motivo selecionado/desselecionado
   * @param {MatCheckboxChange} event - Evento do checkbox
   */
  onReasonChange(reason: Reason, event: MatCheckboxChange) {
    const reasonsArray = this.classRequestForm.get('reasons') as FormArray;
    if (event.checked) {
      reasonsArray.push(this.fb.control(reason));
    } else {
      const index = reasonsArray.controls.findIndex(
        (control) => control.value === reason
      );
      if (index >= 0) {
        reasonsArray.removeAt(index);
      }
    }
  }

  /**
   * Formata a data e hora para o padrão brasileiro
   * @param {Date} date - Data a ser formatada
   * @param {string} time - Hora a ser formatada
   * @returns {string} Data e hora formatadas (ex: "dd/MM/yyyy às HH:mm")
   * @private
   */
  private formatSchedule(date: Date, time: string): string {
    const formattedDate = formatDate(date, 'dd/MM/yyyy', 'en-US');
    return `${formattedDate} às ${time}`;
  }

  /**
   * Prepara os dados do formulário para envio à API
   * @returns {IClassRequest} Objeto com os dados formatados da solicitação
   * @throws {Error} Se o usuário não estiver autenticado
   * @private
   */
  private prepareRequestData(): IClassRequest {
    const formValue = this.classRequestForm.value;

    const preferredDates = formValue.schedules.map((schedule: any) => {
      const date = new Date(schedule.date);
      return this.formatSchedule(date, schedule.time);
    });

    // Obter o token decodificado
    const decodedToken = this.authService.getDecodedToken();

    if (!decodedToken) {
      throw new Error('Token não encontrado');
    }

    // Preparar os dados no formato esperado pelo backend
    const requestData = {
      reason: formValue.reasons,
      preferredDates,
      subjectId: formValue.subjectId,
      additionalInfo: formValue.additionalInfo || '',
      studentId: decodedToken.id,
    };

    return requestData;
  }

  /**
   * Manipula mudanças nos campos de data/hora
   */
  onScheduleChange() {
    this.errorMessage = '';
    this.conflictingSchedule = '';
    this.validateForm();
  }

  /**
   * Manipula a submissão do formulário
   * Valida os dados, prepara a requisição e envia para o servidor
   * Em caso de sucesso, exibe o modal de confirmação
   * Em caso de erro, exibe as mensagens apropriadas
   * @async
   */
  async onSubmit() {
    if (this.classRequestForm.valid) {
      try {
        const requestData = this.prepareRequestData();

        // Verifica se está em modo de edição e se tem um ID válido
        if (this.editMode && this.requestData?.classId) {
          await this.lessonRequestService.updateLessonRequest(
            this.requestData.classId,
            requestData
          );
          this.message = 'Seu pedido de aula foi atualizado com sucesso!';
        } else {
          await this.classRequestService.createClassRequest(requestData);
          this.message = 'Seu pedido de aula foi enviado com sucesso!';
        }

        this.hasScheduleError = false;
        this.errorMessage = '';
        this.conflictingSchedule = '';
        this.scrollToTop();
        this.openRegistrationSuccessDialog();
        this.closeModal.emit('updated');
      } catch (error: any) {
        console.error('Erro na submissão:', error);
        if (error.error?.errors?.[0]) {
          const firstError = error.error.errors[0];
          if (firstError.msg && firstError.value?.[0]) {
            this.hasScheduleError = true;
            this.errorMessage = 'Não é possível agendar este horário:';
            this.conflictingSchedule = firstError.value[0];
          } else {
            this.conflictingSchedule = '';
          }
        } else {
          this.conflictingSchedule = '';
        }
      }
    }
  }

  /**
   * Rola a tela para o topo do modal
   * @protected
   */
  protected scrollToTop(): void {
    const container = document.querySelector('.modal-register');
    if (container) {
      container.scrollTop = 0;
    }
    document.documentElement.scrollTop = 0;
  }

  /**
   * Abre o modal de sucesso de solicitação de aula ao definir `isOpen` como `true`.
   * @public
   */
  public openRegistrationSuccessDialog() {
    this.registrationSuccessModal.isOpen = true;
  }

  /**
   * Fecha o modal de sucesso de solicitação de aula ao definir `isOpen` como `false`
   * e emite o evento `closeModal` para informar o fechamento.
   * @public
   */
  public closeRegistrationSuccessDialog() {
    this.registrationSuccessModal.isOpen = false;
    this.closeModal.emit('updated');
  }

  /**
   * Verifica se uma razão específica está selecionada no formulário.
   * @param {Reason} reason - A razão a ser verificada.
   * @returns {boolean} Retorna true se a razão estiver selecionada, caso contrário, false.
   */
  public isReasonSelected(reason: Reason): boolean {
    const reasonsArray = this.classRequestForm.get('reasons') as FormArray;
    return reasonsArray.controls.some((control) => control.value === reason);
  }

  /**
   * Valida o formulário de solicitação de aulas.
   * Verifica se existem horários inválidos, se não há razões selecionadas
   * e se um assunto foi escolhido.
   *
   * - `hasInvalidSchedules`: Indica se algum dos horários possui erros de validação.
   * - `hasEmptyReasons`: Indica se não há razões selecionadas no formulário.
   * - `hasNoSubject`: Indica se nenhum assunto foi selecionado.
   *
   * Atualiza a propriedade `hasScheduleError` com base nas validações realizadas.
   *
   * @private
   */
  private validateForm() {
    const hasInvalidSchedules = this.schedules.controls.some((control) => {
      return control.get('date')?.errors || control.get('time')?.errors;
    });

    const hasEmptyReasons =
      (this.classRequestForm.get('reasons') as FormArray).length === 0;
    const hasNoSubject = !this.classRequestForm.get('subjectId')?.value;

    this.hasScheduleError =
      hasInvalidSchedules || hasEmptyReasons || hasNoSubject;
    this.cdr.detectChanges();
  }
}
