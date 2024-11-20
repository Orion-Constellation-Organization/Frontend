import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/shared/providers/auth.service';
import { UserType } from 'src/utils/enum/userType.enum';
import { StudentService } from 'src/shared/providers/student.service';
import { Reason, ReasonLabel } from 'src/utils/enum/reason.enum';
import { EnvironmentButton } from 'src/utils/enum/environmentButton.enum';

@Component({
  selector: 'app-lesson-card-manager',
  templateUrl: './lesson-card-manager.component.html',
  styleUrls: ['./lesson-card-manager.component.scss'],
})
export class LessonCardManagerComponent implements OnInit {
  @Input() userName: string = '';
  @Input() educationLevel: string = '';
  @Input() lessonRequests: any[] = [];
  editRequest = EnvironmentButton.EDIT;
  deleteRequest = EnvironmentButton.DELETE;

  constructor(
    private authService: AuthService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  // Retorna até três horários ou todos, se houver menos de três
  getAvailableSchedules(preferredDates: string[]): string[] {
    return preferredDates.length > 3
      ? preferredDates.slice(0, 3)
      : preferredDates;
  }

  private async loadUserData(): Promise<void> {
    try {
      // obter os dados do usuário logado
      const userData = await this.authService.getCurrentUser();
      console.log('Dados do usuário logado carregados com sucesso', userData);

      // obter o nome do usuário logado
      this.userName = userData?.username || 'Usuário';
      console.log(
        'Nome do usuário logado carregado com sucesso:',
        this.userName
      );

      // depois, obtenho os dados completos do usuário
      if (userData?.role === UserType.STUDENT) {
        const studentData = await this.studentService.getStudentById(
          userData.id
        );
        console.log(
          'Dados completos do estudante carregados com sucesso',
          studentData
        );

        // se o usuário é um estudante, obtenho o nível de educação individual
        if (studentData?.educationLevel?.levelType) {
          this.educationLevel = studentData.educationLevel.levelType;
          console.log(
            'Nível de ensino do usuário carregado com sucesso:',
            this.educationLevel
          );
        } else {
          this.educationLevel = 'Não definido';
        }

        // Mapear as solicitações de aula para o formato do card
        this.lessonRequests = studentData.lessonRequests.map(
          (request: any) => ({
            userName: studentData.username,
            educationLevel: studentData.educationLevel.levelType,
            subject:
              request.subject.subjectName || 'Erro ao obter a disciplina',
            reasonType: request.reason
              .map((r: string) => ReasonLabel[r as Reason] || r)
              .join(', '),
            tutorDescription:
              request.additionalInfo || 'Sem informações adicionais',
            availableSchedules: this.getAvailableSchedules(
              request.preferredDates
            ),
          })
        );
        console.log(this.lessonRequests);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário', error);
    }
  }
}
