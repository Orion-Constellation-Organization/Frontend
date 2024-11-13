import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/shared/providers/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userName: string = '';

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    await this.loadUserData();
  }

  private async loadUserData(): Promise<void> {
    try {
      const userData = await this.authService.getCurrentUser();
      if (userData && userData.username) {
        this.userName = userData.username;
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
      this.userName = 'Usuário';
    }
  }
}
