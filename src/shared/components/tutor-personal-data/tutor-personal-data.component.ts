import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ISubjects, ITutorPersonalModal } from 'src/shared/interfaces/ITutorPersonalData.interface';
import { AuthService } from 'src/shared/providers/auth.service';
import { TutorService } from 'src/shared/providers/tutor.service';
import { TutorPersonalModalComponent } from '../tutor-personal-modal/tutor-personal-modal.component';
import { take } from 'rxjs';
import { DialogService } from 'src/shared/providers/dialog.service';

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
    private tutorService: TutorService,
    private dialog: MatDialog,
    private dialogService: DialogService
  ) {}

  public async ngOnInit() {
    try {
      const currentUser = await this.authService.getCurrentUser();
      
      if (currentUser && currentUser.id) {
        const tutorData = await this.tutorService.getTutorById(currentUser.id);
        
        this.username = tutorData.username || 'Usuário';
        this.expertise = tutorData.expertise || 'Ocupação não informada';
        this.projectReason = tutorData.projectReason || 'Motivo não informado';
        this.subjects = tutorData.subjects && tutorData.subjects.length > 0 
          ? tutorData.subjects.map((subject: ISubjects) => subject.name) 
          : [];
      }
    } catch (error) {
      console.error('Erro ao carregar dados do tutor:', error);
      return this.showMessage('Erro ao carregar dados do tutor');
    }
  }

  /**
   * Abre o modal de edição dos dados pessoais do tutor
   * E atualiza as informações exibidas após o fechamento do modal
   */
  public openEditModal(): void {
    const dialogRef = this.dialog.open(TutorPersonalModalComponent, {
        data: {
            username: this.username,
            expertise: this.expertise,
            projectReason: this.projectReason,
            selectedSubjects: this.subjects
        }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((result?: ITutorPersonalModal) => {
        if (result) {
            const { expertise, projectReason, selectedSubjects } = result;

            this.expertise = expertise || this.expertise;
            this.projectReason = projectReason || this.projectReason;
            this.subjects = selectedSubjects || this.subjects;
        }
    });
  }

  /**
   * Mostra uma mensagem usando o dialog service
   * @param message A própria mensagem
   */
  private showMessage(message: string): void {
    this.dialogService.openInfoDialog({
      title: message,
      buttonText: 'Fechar'
    });
  }
}