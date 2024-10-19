import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    // fundo escuro que fica atrás do modal
    trigger('overlay', [
      transition(':enter', [
        // Inicia com o opacity zerado
        style({ opacity: 0 }),

        // efetua a animação de 250ms para o
        // o opacity de 0 até 0.5
        animate('250ms', style({ opacity: 0.5 })),
      ]),
      transition(':leave', [
        // Quando for esconder o overlay,
        // anima do opacity atual, 0.5, até
        // o valor 0
        animate('500ms', style({ opacity: 0 })),
      ]),
    ]),
    // animação na parte branca do modal
    trigger('modal', [
      transition(':enter', [
        // inicia com o modal "lá em cima"
        style({ top: -999 }),

        // e finaliza com o modal no meio da tela
        animate('500ms', style({ top: '50%' })),
      ]),
      transition(':leave', [
        // para esconder o modal, basta
        // "jogar ele lá para cima da tela"
        animate('250ms', style({ top: -999 })),
      ]),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  show = false;
  loginStep: 'login' | 'signUp' | 'studentSignUp' | 'tutorSignUp' = 'login';
  email = 'usuario_tutor@exemplo.com';
  password = 'senhA@123';
 
  hidePassword = true;
  hideConfirmPassword = true;

  constructor(private authService: AuthService, private fb: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  toggle() {
    this.loginStep = 'login';
    this.show = !this.show;
  }

  closeModal() {
    this.loginStep = 'login';
    this.show = false;
  }

  async login() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      await this.authService
        .login({
          email: this.email,
          password: this.password,
        })
        .then((resp) => {
          localStorage.setItem('TutorRegistration', JSON.stringify(loginData));
          console.log('Resposta do login:', resp);
          // this.openRegistrationSuccessDialog();
        })
        .catch((err) => {
          console.log(err);
          //  this.openErrorDialog();
        });
    }
  }
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

}
