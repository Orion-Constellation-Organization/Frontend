import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  ViewChild,
  Input,
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
  /** Flag que controla se o modal está aberto */
  @Input() isOpen = false;
  /** Mensagem que será exibida no modal de sucesso após o envio do pedido de aula */
  @Input() message: string = 'Seu pedido de aula foi enviado com sucesso!';
  /** EventEmitter para fechar o modal */
  @Output() closeModal = new EventEmitter<void>();
  @Input() editMode = false;
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

  /**
   * Construtor do componente
   * @param fb - Serviço FormBuilder para criação de formulários reativos
   * @param classRequestService - Serviço para gerenciar solicitações de aulas
   * @param authService - Serviço de autenticação
   * @param subjectService - Serviço para gerenciar matérias
   */
  constructor(
    private fb: FormBuilder,
    private classRequestService: ClassRequestService,
    private authService: AuthService,
    private subjectService: SubjectService
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
      this.subjects = await this.subjectService.getSubjects();
      if (this.editMode && this.requestData) {
        console.log('Dados recebidos para edição:', this.requestData);
        this.populateFormWithExistingData();
      }
    } catch (error) {
      console.error('Erro ao carregar matérias:', error);
    }
  }

  private populateFormWithExistingData(): void {
    console.log('Populando formulário com dados:', this.requestData);

    //Populando o FormArray de reasons
    // Limpar o FormArray de reasons antes de popular
    const reasonsArray = this.classRequestForm.get('reasons') as FormArray;
    while (reasonsArray.length) {
      reasonsArray.removeAt(0);
    }

    // Dividir a string de razões em um array
    const reasonLabels = this.requestData.reasonType.split(', ');
    console.log('Labels de razões encontradas:', reasonLabels);

    // Para cada label, encontrar o valor do enum correspondente e adicionar ao FormArray
    reasonLabels.forEach((label: string) => {
      const reasonEntry = Object.entries(ReasonLabel).find(
        ([_, value]) => value === label
      );
      if (reasonEntry) {
        const [enumValue] = reasonEntry;
        reasonsArray.push(this.fb.control(enumValue));
      }
    });

    //Populando o FormArray de schedules
    // Limpar o FormArray de schedules antes de popular
    const schedulesArray = this.schedules;
    while (schedulesArray.length) {
      schedulesArray.removeAt(0);
    }

    // Processar cada horário disponível
    this.requestData.availableSchedules.forEach((schedule: string) => {
      console.log('Processando horário:', schedule);
      const [dateStr, timeStr] = schedule.split(' ');

      // Criar um objeto Date a partir da string de data
      const date = new Date(dateStr);

      // Adicionar ao FormArray
      schedulesArray.push(
        this.fb.group({
          date: [date],
          time: [timeStr],
        })
      );
    });

    // Populando o campo de subjectId
    // Atualizar os outros campos do formulário
    const subjectId = this.subjects.find(
      (s) => s.subjectName === this.requestData.subject
    )?.subjectId;
    console.log('Subject ID encontrado:', subjectId);

    // Populando o campo de additionalInfo
    this.classRequestForm.patchValue({
      subjectId: subjectId,
      additionalInfo: this.requestData.tutorDescription,
    });

    console.log('Estado final do formulário:', this.classRequestForm.value);
  }

  private parseSchedule(schedule: string): [Date, string] {
    console.log('Parseando horário:', schedule);
    // Formato esperado: "dd/MM/yyyy às HH:mm"
    const [datePart, timePart] = schedule.split(' às ');
    const [day, month, year] = datePart.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return [date, timePart];
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
    const decodedToken = this.authService.getDecodedToken();

    if (!decodedToken?.id) {
      throw new Error('Usuário não autenticado');
    }

    const preferredDates = formValue.schedules.map((schedule: any) =>
      this.formatSchedule(schedule.date, schedule.time)
    );

    return {
      reason: formValue.reasons,
      preferredDates,
      subjectId: formValue.subjectId,
      additionalInfo: formValue.additionalInfo || '',
      studentId: decodedToken.id,
    };
  }

  /**
   * Manipula mudanças nos campos de data/hora
   */
  onScheduleChange() {
    if (this.hasScheduleError) {
      this.hasScheduleError = false;
      this.errorMessage = '';
      this.conflictingSchedule = '';
    }
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

        if (this.editMode) {
          // Passando o ID da solicitação que está sendo editada
          await this.classRequestService.updateClassRequest(
            this.requestData.classId, // ou onde quer que você tenha o ID
            requestData
          );
        } else {
          await this.classRequestService.createClassRequest(requestData);
        }

        this.hasScheduleError = false;
        this.errorMessage = '';
        this.conflictingSchedule = '';
        this.scrollToTop();
        this.openRegistrationSuccessDialog();
      } catch (error: any) {
        if (error.error?.errors?.[0]) {
          const firstError = error.error.errors[0];
          if (firstError.msg && firstError.value?.[0]) {
            this.hasScheduleError = true;
            this.errorMessage = 'Não é possível agendar este horário:';
            this.conflictingSchedule = firstError.value[0];

            // Resetar todos os campos de horário
            while (this.schedules.length > 0) {
              this.schedules.removeAt(0);
            }
            this.schedules.push(this.createScheduleControl());
          } else {
            this.errorMessage =
              firstError.msg ||
              'Ocorreu um erro ao enviar a solicitação. Tente novamente.';
            this.conflictingSchedule = '';
          }
        } else {
          this.errorMessage =
            'Ocorreu um erro ao enviar a solicitação. Tente novamente.';
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
    this.closeModal.emit();
  }

  // Adicionar um método para verificar se uma razão está selecionada
  isReasonSelected(reason: Reason): boolean {
    const reasonsArray = this.classRequestForm.get('reasons') as FormArray;
    return reasonsArray.controls.some((control) => control.value === reason);
  }
}
