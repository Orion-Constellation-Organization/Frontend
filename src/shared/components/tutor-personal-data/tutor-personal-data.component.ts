import { Component, OnInit } from '@angular/core';
import { ISubjects } from 'src/shared/interfaces/ITutorPersonalData.interface';
import { AuthService } from 'src/shared/providers/auth.service';
import { TutorService } from 'src/shared/providers/tutor.service';

@Component({
  selector: 'app-tutor-personal-data',
  templateUrl: './tutor-personal-data.component.html',
  styleUrls: ['./tutor-personal-data.component.scss']
})
export class TutorPersonalDataComponent implements OnInit {
  username: string = '';
  expertise: string = '';
  projectReason: string = '';
  subjects: string[] = [];

  constructor(
    private authService: AuthService,
    private tutorService: TutorService
  ) {}

  async ngOnInit() {
    try {
      const currentUser = await this.authService.getCurrentUser();
      
      if (currentUser && currentUser.id) {
        const tutorData = await this.tutorService.getTutorById(currentUser.id);
        
        this.username = tutorData.username || 'Usuário';
        this.expertise = tutorData.expertise || 'Ocupação não informada';
        this.projectReason = tutorData.projectReason || 'Motivo não informado';
        
        this.subjects = tutorData.subjects && tutorData.subjects.length > 0 
          ? tutorData.subjects.map((subject: ISubjects) => subject.name) 
          : ['Disciplinas não informadas'];
      }
    } catch (error) {
      console.error('Erro ao carregar dados do tutor:', error);
    }
  }
}