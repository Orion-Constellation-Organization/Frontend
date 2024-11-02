import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistrationSuccessModalComponent } from 'src/shared/components/registration-success-modal/registration-success-modal.component';
import { StudentService } from '../../../shared/providers/student.service';
import { RegistrationBaseComponent } from 'src/utils/abstract/registration-base.component';

/**
 * Componente de formulário de cadastro para alunos.
 * Extende a funcionalidade da classe `RegistrationBaseComponent` para gerenciar
 * o cadastro e validação dos dados de alunos.
 */
@Component({
  selector: 'app-student-registration-form',
  templateUrl: './student-registration-form.component.html',
  styleUrls: ['./student-registration-form.component.scss'],
})
export class StudentRegistrationFormComponent extends RegistrationBaseComponent {
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
   * Inicializa o componente com as dependências de formulário, roteamento e serviço do aluno.
   * @param fb Instância do FormBuilder para criação e controle de formulários.
   * @param router Serviço de roteamento Angular.
   * @param tutorService Serviço responsável por operações relacionadas ao cadastro de alunos.
   */
  constructor(
    fb: FormBuilder,
    private router: Router,
    private studentService: StudentService
  ) {
    super(fb);
    this.removeCpfControl();
  }

  /**
   * Remove o controle `cpf` do formulário de registro e transforma o controle de `educationLevel`.
   * Essa modificação é feita para adaptar o formulário às necessidades específicas de cadastro de estudante.
   * @private
   */
  private removeCpfControl() {
    this.registrationForm.removeControl('cpf');
    this.transformEducationLevelControl();
  }

  /**
   * Transforma o controle `educationLevel` para aceitar apenas um valor único.
   * Remove o controle `educationLevel` atual e o adiciona novamente com um único valor,
   * mantendo o valor atual caso já esteja definido.
   * @private
   */
  private transformEducationLevelControl() {
    const currentValue = this.registrationForm.get('educationLevel')?.value;
    this.registrationForm.removeControl('educationLevel');
    this.registrationForm.addControl(
      'educationLevel',
      this.fb.control(
        Array.isArray(currentValue) ? currentValue[0] : currentValue
      )
    );
  }

  /**
   * Submete o formulário de cadastro de aluno.
   * Caso os dados sejam válidos, tenta cadastrar o tutor utilizando o serviço `StudentService`.
   *
   * **Funcionalidades:**
   *      * Valida o formulário.
   *      * Prepara os dados para envio ao servidor.
   *      * Envia os dados para o serviço de criação de alunos.
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
      const registrationData = this.prepareDataForSubmissionStudent(formData);

      try {
        const response = await this.studentService.createStudent(
          registrationData
        );
        localStorage.setItem(
          'studentRegistration',
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
