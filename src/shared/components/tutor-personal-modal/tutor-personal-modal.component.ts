import { Component, Inject, OnInit } from '@angular/core'; 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubjectService } from 'src/shared/providers/subject.service';
import { TutorService } from 'src/shared/providers/tutor.service';
import { AuthService } from 'src/shared/providers/auth.service';
import { ISubjects, ITutorPersonalModal } from 'src/shared/interfaces/ITutorPersonalData.interface';
import { LoadingService } from 'src/shared/providers/loading.service';
import { DialogService } from 'src/shared/providers/dialog.service';

@Component({
  selector: 'app-tutor-personal-modal',
  templateUrl: './tutor-personal-modal.component.html',
  styleUrls: ['./tutor-personal-modal.component.scss']
})
export class TutorPersonalModalComponent implements OnInit {
  tutorForm: FormGroup;
  subjects: string[] = [];
  username: string = '';

  constructor(
    public dialogRef: MatDialogRef<TutorPersonalModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ITutorPersonalModal,
    private formBuilder: FormBuilder,
    private subjectService: SubjectService,
    private tutorService: TutorService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private dialogService: DialogService
  ) {
    this.tutorForm = this.formBuilder.group({
      expertise: ['', [Validators.required, Validators.maxLength(50)]],
      projectReason: ['', [Validators.required, Validators.maxLength(200)]],
      subjects: [[], Validators.required]
    });
  }

  public ngOnInit(): void {
    this.username = this.data.username;

    this.tutorForm.patchValue({
      expertise: this.data.expertise || '',
      projectReason: this.data.projectReason || '',
      subjects: this.data.selectedSubjects || []
    });
    
    this.loadSubjects();
  }

  /**
   * Alterna o estado de seleção de uma disciplina
   * @param subject Nome da disciplina a ser adicionada ou removida da seleção
   */
  public toggleSubject(subject: string): void {
    const currentSubjects = this.tutorForm.get('subjects')?.value.slice() || [];
    const index = currentSubjects.indexOf(subject);
  
    index === -1
      ? currentSubjects.push(subject)
      :currentSubjects.splice(index, 1);
    
    this.tutorForm.get('subjects')?.setValue(currentSubjects);
  }

  /**
   * Carrega a lista de disciplinas disponíveis no back para seleção
   */
  private async loadSubjects(): Promise<void> {
    this.loadingService.show();
    try {
      const subjectsResponse = await this.subjectService.getSubjects();
      this.subjects = subjectsResponse.map(subject => subject.subjectName);
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error);
      return this.showMessage('Erro ao carregar disciplinas');
    } finally {
      this.loadingService.hide();
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
  public async onSubmit(): Promise<void> {
    if (this.tutorForm.invalid) {
      return;
    }

    this.loadingService.show();
    try {
      const currentUser = await this.authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Usuário não encontrado');
      }

      const tutorData = await this.tutorService.getTutorById(currentUser.id);
      const allSubjects = await this.subjectService.getSubjects();

      const selectedSubjectIds = this.tutorForm.get('subjects')?.value.map((selectedSubjectName: string) => {
        const matchedSubject = allSubjects.find(
          subject => subject.subjectName === selectedSubjectName
        );
        
        return matchedSubject ? matchedSubject.subjectId : undefined;
      });

      const subjectIds = selectedSubjectIds.filter((id: number | undefined) => id !== undefined);

      const payload = {
        id: currentUser.id,
        expertise: this.tutorForm.get('expertise')?.value || tutorData.expertise,
        projectReason: this.tutorForm.get('projectReason')?.value || tutorData.projectReason,
        subject: subjectIds.length > 0 
          ? subjectIds 
          : tutorData.subjects.map((subject: ISubjects) => subject.id)
      };

      await this.tutorService.updateTutorPersonalData(payload);

      const result: ITutorPersonalModal = {
        username: this.username,
        expertise: payload.expertise,
        projectReason: payload.projectReason,
        selectedSubjects: this.tutorForm.get('subjects')?.value.length > 0 
          ? this.tutorForm.get('subjects')?.value 
          : tutorData.subjects.map((subject: ISubjects) => subject.name)
      };

      this.dialogRef.close(result);
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      return this.showMessage('Erro ao salvar dados');
    } finally {
      this.loadingService.hide();
    }
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