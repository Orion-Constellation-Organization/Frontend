import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { cpf } from 'cpf-cnpj-validator';
import { ICreateStudent } from 'src/shared/interfaces/student.interface';
import { ICreateTutor } from 'src/shared/interfaces/tutor.interface';
import { IEducationLevel } from 'src/shared/interfaces/education-level.interface';
import { EducationLevelService } from 'src/shared/providers/education-level.service';

/**
 * Classe abstrata base para formulários de registro no sistema.
 * Fornece funcionalidades comuns para registro de estudantes e tutores.
 *
 * @abstract
 * @class RegistrationBaseComponent
 * @property {FormGroup} registrationForm - Formulário reativo para gerenciar os dados de registro.
 * @property {string} errorMessage - Mensagem de erro para exibição ao usuário.
 * @property {boolean} showPasswordCriteria - Controla a visibilidade dos critérios de senha e confirmação da senha.
 * @property {Object} passwordCriteria - Objeto que rastreia os critérios de validação da senha e confirmação da senha.
 * @property {string[]} educationLevels - Lista de níveis educacionais disponíveis.
 */

@Component({
  template: '',
})
export abstract class RegistrationBaseComponent {
  registrationForm!: FormGroup;
  errorMessage = '';
  showPasswordCriteria = false;
  passwordCriteria = {
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  };

  educationLevels: IEducationLevel[] = [];

  /**
   * Inicializa o componente base de registro.
   *
   * @param {FormBuilder} fb - Instância do FormBuilder para criar o formulário reativo.
   */
  constructor(
    protected fb: FormBuilder,
    protected educationLevelService?: EducationLevelService
  ) {
    this.initializeForm();
  }

  /**
   * Método do ciclo de vida do Angular executado na inicialização do componente.
   * Carrega os níveis educacionais se o serviço estiver disponível.
   */
  ngOnInit(): void {
    if (this.educationLevelService) {
      this.loadEducationLevels();
    }
  }

  /**
   * Carrega os níveis educacionais disponíveis através do serviço.
   * Em caso de erro, exibe uma mensagem de erro no console e atualiza a mensagem de erro do componente.
   *
   * @private
   */
  private async loadEducationLevels(): Promise<void> {
    try {
      if (this.educationLevelService) {
        this.educationLevels =
          await this.educationLevelService.getEducationLevels();
      }
    } catch (error) {
      console.error('Erro ao carregar níveis educacionais:', error);
      this.errorMessage = 'Erro ao carregar níveis educacionais';
    }
  }

  /**
   * Inicializa o formulário reativo com todos os campos necessários e suas validações.
   *
   * @protected
   */
  protected initializeForm(): void {
    this.registrationForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        username: ['', Validators.required],
        birthDate: ['', [Validators.required, this.birthDateValidator]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
        educationLevel: [null, Validators.required],
        cpf: ['', [Validators.required, this.cpfValidator]],
      },
      { validator: this.passwordMatchValidator }
    );
    // Observa alterações no campo de senha para verificar os critérios de segurança
    this.registrationForm
      .get('password')
      ?.valueChanges.subscribe((password: string) => {
        this.passwordCriteria.hasMinLength = password.length >= 6;
        this.passwordCriteria.hasUpperCase = /[A-Z]/.test(password);
        this.passwordCriteria.hasLowerCase = /[a-z]/.test(password);
        this.passwordCriteria.hasNumber = /\d/.test(password);
        this.passwordCriteria.hasSpecialChar = /[@$!%*?&]/.test(password);
      });
  }

  /**
   * Controla a exibição dos critérios de senha quando o campo recebe foco.
   *
   * @protected
   */
  protected onPasswordFocus(): void {
    this.showPasswordCriteria = true;
  }

  /**
   * Validador personalizado para o campo CPF.
   *
   * @param {AbstractControl} control - Controle do formulário a ser validado.
   * @returns {ValidationErrors | null} Retorna null se válido ou um objeto de erro se inválido.
   * @protected
   */
  protected cpfValidator(control: AbstractControl): ValidationErrors | null {
    return cpf.isValid(control.value) ? null : { cpfInvalid: true };
  }

  /**
   * Validador personalizado para o campo de data de nascimento.
   * Verifica se a data selecionada não é futura.
   *
   * @param {AbstractControl} control - Controle do formulário a ser validado.
   * @returns {ValidationErrors | null} Retorna null se válido ou um objeto de erro se inválido.
   * @protected
   */
  protected birthDateValidator(control: AbstractControl) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    return selectedDate > today ? { futureDate: true } : null;
  }

  /**
   * Validador personalizado para verificar se as senhas coincidem.
   *
   * @param {FormGroup} FormGroup - Grupo de formulário contendo os campos de senha.
   * @returns {ValidationErrors | null} Retorna null se as senhas coincidirem ou um objeto de erro caso contrário.
   * @protected
   */
  protected passwordMatchValidator(FormGroup: FormGroup) {
    const password = FormGroup.get('password')?.value;
    const confirmPassword = FormGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /**
   * Formata a data de nascimento para o padrão dd/mm/yyyy.
   *
   * @param {string} dateString - String da data no formato ddmmyyyy
   * @returns {string} Data formatada no padrão dd/mm/yyyy
   * @protected
   */
  protected formatBirthDate(dateString: string): string {
    const day = dateString.substring(0, 2);
    const month = dateString.substring(2, 4);
    const year = dateString.substring(4, 8);
    return `${day}/${month}/${year}`;
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
   * Prepara os dados do formulário para submissão no formato esperado para tutores.
   *
   * @param {any} formData - Dados do formulário a serem processados.
   * @returns {ICreateTutor} Objeto formatado para criação de tutor.
   * @protected
   */
  protected prepareDataForSubmissionTutor(formData: any): ICreateTutor {
    const birthDate = this.formatBirthDate(formData.birthDate);
    const educationLevelIds = formData.educationLevel.map(
      (level: IEducationLevel) => level.educationId
    );

    return {
      fullName: formData.fullName.trim(),
      username: formData.username.trim(),
      birthDate: birthDate,
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      cpf: formData.cpf,
      confirmPassword: formData.confirmPassword,
      educationLevelIds: educationLevelIds,
    };
  }

  /**
   * Prepara os dados do formulário para submissão no formato esperado para estudantes.
   *
   * @param {any} formData - Dados do formulário a serem processados.
   * @returns {ICreateStudent} Objeto formatado para criação de estudante.
   * @protected
   */
  protected prepareDataForSubmissionStudent(formData: any): ICreateStudent {
    const birthDate = this.formatBirthDate(formData.birthDate);
    const educationLevelId = formData.educationLevel.educationId;

    return {
      fullName: formData.fullName.trim(),
      username: formData.username.trim(),
      birthDate: birthDate,
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      educationLevelId: educationLevelId,
    };
  }
}
