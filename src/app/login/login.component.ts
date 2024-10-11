import { Component, } from '@angular/core';
import {
  trigger,
  style,
  animate,
  transition
} from '@angular/animations';

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
        animate('250ms', style({ opacity: .5 })),
      ]),
      transition(':leave', [
        // Quando for esconder o overlay, 
        // anima do opacity atual, 0.5, até
        // o valor 0
        animate('500ms', style({ opacity: 0 }))
      ])
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
    animate('250ms', style({ top: -999 }))
  ])
  ]),
] 
})
export class LoginComponent {
  mostrar: boolean = false;
  toggle() {
    this.mostrar = !this.mostrar;
  }
  closeModal() {
    this.mostrar = false;
  }
}