import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  TitleOne = 'Agendadas';
  TitleTwo = 'Pedidos de Tutoria';
  TitleThree = 'Aguardando confirmação do Aluno';
  tutor = 'fulano';

  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
