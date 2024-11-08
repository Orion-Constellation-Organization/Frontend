import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationBaseComponent } from '../../../utils/abstract/registration-base.component';
import { RegistrationSuccessModalComponent } from 'src/shared/components/registration-success-modal/registration-success-modal.component';
import { TutorService } from '../../../shared/providers/tutor.service';
import { EducationLevelService } from '../../../shared/providers/education-level.service';

/**
 * Componente de formulário de cadastro para tutores.
 * Extende a funcionalidade da classe `RegistrationBaseComponent` para gerenciar
 * o cadastro e validação dos dados de tutores.
 */
@Component({
  selector: 'app-tutor-registration-form',
  templateUrl: './tutor-registration-form.component.html',
  styleUrls: ['./tutor-registration-form.component.scss'],
})
export class TutorRegistrationFormComponent extends RegistrationBaseComponent {
  /**
   * Indica se o formulário está aberto ou fechado.
   *
   * @type {boolean}
   */
  @Input() isOpen = false;

  /**
   * Evento emitido quando o modal deve ser fechado.
   *
   * @type {EventEmitter<void>}
   */
  @Output() closeModal = new EventEmitter<void>();

  /**
   * Evento emitido quando o usuário deseja voltar para a etapa anterior.
   *
   * @type {EventEmitter<void>}
   */
  @Output() goBack = new EventEmitter<void>();

  /**
   * Referência para o componente filho `RegistrationSuccessModalComponent`, que exibe
   * o modal de sucesso após o registro.
   *
   * @type {RegistrationSuccessModalComponent}
   */
  @ViewChild(RegistrationSuccessModalComponent)
  registrationSuccessModal!: RegistrationSuccessModalComponent;

  /**
   * Inicializa o componente com as dependências de formulário, roteamento e serviço do tutor.
   * @param fb Instância do FormBuilder para criação e controle de formulários.
   * @param router Serviço de roteamento Angular.
   * @param tutorService Serviço responsável por operações relacionadas ao cadastro de tutores.
   * @param educationLevelService Serviço responsável por operações relacionadas aos níveis de educação.
   */
  constructor(
    fb: FormBuilder,
    private router: Router,
    private tutorService: TutorService,
    educationLevelService: EducationLevelService
  ) {
    super(fb, educationLevelService);
  }

  /**
   * Submete o formulário de cadastro de tutor.
   * Caso os dados sejam válidos, tenta cadastrar o tutor utilizando o serviço `TutorService`.
   *
   * **Funcionalidades:**
   *      * Valida o formulário.
   *      * Prepara os dados para envio ao servidor.
   *      * Envia os dados para o serviço de criação de tutores.
   *      * Armazena os dados do registro no localStorage.
   *      * Volta o modal para o topo.
   *      * Abre um diálogo de sucesso caso a operação seja bem-sucedida.
   *      * Exibe uma mensagem de erro caso ocorra algum problema.
   *
   * @async
   * @throws {Error} Se houver falha na comunicação com o servidor ou erro na validação.
   * @returns {Promise<void>} Uma promise que resolve após a conclusão do processo de submissão.
   */
  async onSubmit() {
    this.errorMessage = '';

    if (this.registrationForm.valid) {
      const formData = this.registrationForm.value;
      const registrationData = this.prepareDataForSubmissionTutor(formData);

      try {
        const response = await this.tutorService.createTutor(registrationData);
        localStorage.setItem(
          'tutorRegistration',
          JSON.stringify(registrationData)
        );
        this.scrollToTop();
        this.openRegistrationSuccessDialog();
      } catch (error: any) {
        console.error('Erro detalhado:', error);
        this.errorMessage = `Erro ao realizar cadastro: ${
          error.error?.message || 'Por favor, tente novamente.'
        }`;
      }
    } else {
      this.errorMessage =
        'Por favor, preencha todos os campos obrigatórios corretamente.';
    }
  }

  /**
   * Abre o modal de sucesso de cadastro ao definir `isOpen` como `true`.
   */
  public openRegistrationSuccessDialog() {
    this.registrationSuccessModal.isOpen = true;
  }

  /**
   * Fecha o modal de sucesso de cadastro ao definir `isOpen` como `false`
   * e emite o evento `closeModal` para informar o fechamento.
   */
  public closeRegistrationSuccessDialog() {
    this.registrationSuccessModal.isOpen = false;
    this.closeModal.emit();
  }

  /**
   * Emite o evento `goBack` para navegar para a tela anterior do modal.
   */
  public navigateBack() {
    this.goBack.emit();
  }
}
