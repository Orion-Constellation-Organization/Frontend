import { Component, Inject, OnInit } from '@angular/core'; 
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubjectService } from 'src/shared/providers/subject.service';
import { TutorService } from 'src/shared/providers/tutor.service';
import { AuthService } from 'src/shared/providers/auth.service';
import { ISubjects, ITutorPersonalModal } from 'src/shared/interfaces/ITutorPersonalData.interface';
import { LoadingService } from 'src/shared/providers/loading.service';

@Component({
  selector: 'app-tutor-personal-modal',
  templateUrl: './tutor-personal-modal.component.html',
  styleUrls: ['./tutor-personal-modal.component.scss']
})
export class TutorPersonalModalComponent implements OnInit {
  subjects: string[] = [];
  tempSelectedSubjects: string[] = [];
  username: string = '';
  expertise: string = '';
  projectReason: string = '';

  constructor(
    public dialogRef: MatDialogRef<TutorPersonalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITutorPersonalModal,
    private subjectService: SubjectService,
    private tutorService: TutorService,
    private authService: AuthService,
    private loadingService: LoadingService
  ) {}

  public ngOnInit(): void {
    this.username = this.data.username;
    this.expertise = this.data.expertise || '';
    this.projectReason = this.data.projectReason || '';
    this.tempSelectedSubjects = this.data.selectedSubjects 
      ? this.data.selectedSubjects.slice() 
      : [];
    
    this.loadSubjects();
  }

  /**
   * Alterna o estado de seleção de uma disciplina
   * @param subject Nome da disciplina a ser adicionada ou removida da seleção
   */
  public toggleSubject(subject: string): void {
    const index = this.tempSelectedSubjects.indexOf(subject);
    index === -1 
      ? this.tempSelectedSubjects.push(subject) 
      : this.tempSelectedSubjects.splice(index, 1);
  }

  /**
   * Carrega a lista de disciplinas disponíveis no back para seleção
   */
  private async loadSubjects(): Promise<void> {
    try {
      const subjectsResponse = await this.subjectService.getSubjects();
      this.subjects = subjectsResponse.map(subject => subject.subjectName);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
    }
  }

  /**
   * Fecha o modal sem salvar as alterações.
   */
  public onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Salva as alterações nos dados pessoais do tutor e fecha o modal.
   */
  public async onSave(): Promise<void> {
    this.loadingService.show();
    try {
        const currentUser = await this.authService.getCurrentUser();
        if (!currentUser) {
            throw new Error('Usuário não encontrado');
        }

        const tutorData = await this.tutorService.getTutorById(currentUser.id);
        const allSubjects = await this.subjectService.getSubjects();

        const selectedSubjectIds = this.tempSelectedSubjects.map(selectedSubjectName => {
            const matchedSubject = allSubjects.find(
                subject => subject.subjectName === selectedSubjectName
            );
            
            return matchedSubject ? matchedSubject.subjectId : undefined;
        });

        const subjectIds = selectedSubjectIds.filter(id => id !== undefined);

        const payload = {
            id: currentUser.id,
            expertise: this.expertise || tutorData.expertise,
            projectReason: this.projectReason || tutorData.projectReason,
            subject: subjectIds.length > 0 
                ? subjectIds 
                : tutorData.subjects.map((subject: ISubjects) => subject.id)
        };

        await this.tutorService.updateTutorPersonalData(payload);

        const result: ITutorPersonalModal = {
            username: this.username,
            expertise: payload.expertise,
            projectReason: payload.projectReason,
            selectedSubjects: this.tempSelectedSubjects.length > 0 
                ? this.tempSelectedSubjects 
                : tutorData.subjects.map((subject: ISubjects) => subject.name)
        };

        this.dialogRef.close(result);
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
    } finally {
        this.loadingService.hide();
    }
  }
}