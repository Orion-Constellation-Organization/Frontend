import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/shared/providers/auth.service';
import { userState } from 'src/utils/enum/userState.enum';

/**
 * Componente responsável pela autenticação de usuários através do login.
 *
 * @component
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  /**
   * Formulário de login utilizado para capturar as credenciais do usuário.
   *
   * @type {FormGroup}
   */
  loginForm!: FormGroup;

  /**
   * Indica se o modal de login deve ser exibido.
   *
   * @type {boolean}
   */
  show = false;

  /**
   * Enum que define os estados do usuário.
   *
   * @type {typeof userState}
   */
  userState = userState;

  /**
   * Estado atual do login (login ou registro).
   *
   * @type {userState}
   */
  loginStep: userState = userState.login;

  /**
   * Indica se o modal de login está aberto.
   *
   * @type {boolean | undefined}
   */
  isLoginModalOpen: boolean | undefined;

  /**
   * Indica se o modal de registro está aberto.
   *
   * @type {boolean | undefined}
   */
  isRegistrationModalOpen: boolean | undefined;

  /**
   * Construtor do componente, injetando o serviço de autenticação e o FormBuilder.
   *
   * @param {AuthService} authService - Serviço de autenticação para gerenciar operações de login.
   * @param {FormBuilder} fb - Construtor do formulário.
   */
  constructor(private authService: AuthService, private fb: FormBuilder) {}

  /**
   * Inicializa o componente, configurando o formulário de login.
   */
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  /**
   * Alterna a visibilidade do modal de login, adicionando ou removendo classes de animação.
   */
  toggle() {
    if (!this.show) {
      this.show = true;
      setTimeout(() => {
        const modal = document.querySelector('.modal');
        if (modal) {
          modal.classList.add('modal-enter');
        }
      }, 0);
    } else {
      const modal = document.querySelector('.modal');
      if (modal) {
        modal.classList.remove('modal-enter');
        modal.classList.add('modal-leave');

        setTimeout(() => {
          this.show = false;
          modal.classList.remove('modal-leave');
        }, 500);
      }
    }
  }

  /**
   * Fecha o modal de login e limpa o formulário.
   */
  closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
      modal.classList.add('modal-leave');
      setTimeout(() => {
        this.show = false;
        this.clearFormModal();
        modal.classList.remove('modal-leave');
      }, 250);
    }
  }

  /**
   * Limpa os campos do formulário de login.
   */
  clearFormModal() {
    this.loginForm.reset();
  }

  /**
   * Realiza o login do usuário utilizando as credenciais fornecidas no formulário.
   */
  async login() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      await this.authService
        .login({
          email: loginData.email,
          password: loginData.password,
        })
        .then((resp) => {
          localStorage.setItem('TutorRegistration', JSON.stringify(loginData));
          console.log('Resposta do login:', resp);
          this.loginForm.reset();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  /**
   * Retorna à tela anterior, exibindo o modal de login.
   */
  handleGoBack() {
    this.showLoginModal();
  }

  /**
   * Exibe o modal de login e oculta o modal de registro.
   */
  showLoginModal() {
    this.isLoginModalOpen = true;
    this.isRegistrationModalOpen = false;
  }

  /**
   * Exibe o modal de registro e oculta o modal de login.
   */
  showRegistrationModal() {
    this.isLoginModalOpen = false;
    this.isRegistrationModalOpen = true;
  }
}
