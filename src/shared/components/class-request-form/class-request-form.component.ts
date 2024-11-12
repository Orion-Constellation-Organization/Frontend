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

  /** Formulário principal de solicitação de aulas */
  classRequestForm: FormGroup;
  /** Lista de opções de motivos para a solicitação */
  reasonOptions = Object.values(Reason).map((reason) => ({
    value: reason,
    label: ReasonLabel[reason],
  }));

  /** Lista de matérias disponíveis */
  subjects: ISubject[] = [];

  /** Enum de botões de ambiente */
  EnvironmentButton = EnvironmentButton;

  /** Referência ao componente do modal de sucesso */
  @ViewChild(RegistrationSuccessModalComponent)
  registrationSuccessModal!: RegistrationSuccessModalComponent;

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
    } catch (error) {
      console.error('Erro ao carregar matérias:', error);
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
   * Getter para acessar o FormArray de agendamentos
   */
  get schedules() {
    return this.classRequestForm.get('schedules') as FormArray;
  }

  /**
   * Adiciona um novo agendamento ao formulário, limitado a 3 horários
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
   * @param index - Índice do agendamento a ser removido
   */
  removeSchedule(index: number) {
    this.schedules.removeAt(index);
  }

  /**
   * Manipula a mudança nos checkboxes de motivos
   * @param reason - Motivo selecionado
   * @param event - Evento de mudança do checkbox
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
   * Formata a data e hora para o formato desejado
   * @param date - Data a ser formatada
   * @param time - Hora a ser formatada
   * @returns String formatada com data e hora
   */
  private formatSchedule(date: Date, time: string): string {
    const formattedDate = formatDate(date, 'dd/MM/yyyy', 'en-US');
    return `${formattedDate} às ${time}`;
  }

  /**
   * Prepara os dados do formulário para envio
   * @returns Objeto IClassRequest com os dados formatados
   * @throws Error se o usuário não estiver autenticado
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
   * Manipula a submissão do formulário
   * Valida, prepara e envia os dados para o servidor
   */
  async onSubmit() {
    if (this.classRequestForm.valid) {
      try {
        const requestData = this.prepareRequestData();
        await this.classRequestService.createClassRequest(requestData);
        this.scrollToTop();
        this.openRegistrationSuccessDialog();
      } catch (error) {
        console.error('Erro ao enviar solicitação:', error);
      }
    }
  }

  /**
   * Scrolla o modal para o topo.
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
   */
  public openRegistrationSuccessDialog() {
    this.registrationSuccessModal.isOpen = true;
  }

  /**
   * Fecha o modal de sucesso de solicitação de aula ao definir `isOpen` como `false`
   * e emite o evento `closeModal` para informar o fechamento.
   */
  public closeRegistrationSuccessDialog() {
    this.registrationSuccessModal.isOpen = false;
    this.closeModal.emit();
  }
}
