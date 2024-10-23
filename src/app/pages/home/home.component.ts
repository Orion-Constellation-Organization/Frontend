import { Component, ViewChild } from '@angular/core';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  title = 'Reforca o bem';

  @ViewChild('modal') modalComponent!: LoginComponent;

  // ngAfterViewInit() {
  //   // O @ViewChild estará disponível aqui
  // }

  mostrarModal() {
    if (this.modalComponent) {
      this.modalComponent.toggle(); // Agora pode chamar o método toggle
    } else {
      console.error('modalComponent não está disponível!');
    }
  }
}
