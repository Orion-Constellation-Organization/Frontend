import { Component, ViewChild } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  public currentYear: number;
  public menuItems = [
    { label: 'Quem somos', section: 'banner' },
    { label: 'Como funciona', section: 'how' },
    { label: 'Reforço escolar', section: 'reinforce' },
    { label: 'Acompanhamento', section: 'monitoring' }
  ];
  @ViewChild('modalComponent') modalComponent!: LoginComponent;

  public constructor(private router: Router) {
    this.currentYear = new Date().getFullYear();
  }

  /**
   * Sends the user to a determined section of the page.
   * @param sectionId The id of the sectiom that the user is going to be redirected
   */
  public scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);

    if (element) {
      const offsetTop = element.offsetTop - 80;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  }

  /**
   * Exibe o modal de login, configurando o estado de login no componente de login.
   * Se o componente de login não estiver disponível, exibe um erro no console.
   */
  showModal() {
    if (this.modalComponent) {
      this.modalComponent.loginStep = this.modalComponent.userState.login;
      this.modalComponent.toggle();
    } else {
      console.error('modalComponent não está disponível!');
    }
  }
}
