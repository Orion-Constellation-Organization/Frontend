import { Component,ViewChild  } from '@angular/core';
import { LoginComponent } from '../login/login.component'; 


@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['../../styles/theme.scss'],
  
})
export class HomeComponent {
  title = 'Reforca o bem';
  acaoPrimaria(){
    // ah
  }

  @ViewChild('modal') modalComponent!: LoginComponent;
  mostrarModal() {
    this.modalComponent.toggle();
  }
}
