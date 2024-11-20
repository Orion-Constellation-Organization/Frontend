import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from 'src/shared/providers/auth.service';
import { EducationLevelService } from 'src/shared/providers/education-level.service';
import { UserType } from 'src/utils/enum/userType.enum';
import { StudentService } from 'src/shared/providers/student.service';
import { TutorService } from 'src/shared/providers/tutor.service';
import { SubjectService } from 'src/shared/providers/subject.service';
import { IStudentResponse } from 'src/shared/interfaces/student-response.interface';

@Component({
  selector: 'app-lesson-card-manager',
  templateUrl: './lesson-card-manager.component.html',
  styleUrls: ['./lesson-card-manager.component.scss'],
})
export class LessonCardManagerComponent implements OnInit {
  @Input() userName: string = ''; // Nome do usuário, essa informação eu busco pelo id do usuário logado
  @Input() educationLevel: string = ''; // Nível de ensino, essa informação eu busco pelo id do usuário logado
  @Input() lessonRequests: any[] = [];

  constructor(
    private authService: AuthService,
    private educationLevelService: EducationLevelService,
    private studentService: StudentService,
    private tutorService: TutorService,
    private subjectService: SubjectService
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

      // obter os níveis de ensino disponíveis
      // const educationLevels =
      //   await this.educationLevelService.getEducationLevels();
      // console.log(
      //   'Todos os níveis de ensino carregados com sucesso',
      //   educationLevels
      // );

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
            subject: request.subject || 'Matemática', // Substitua conforme necessário
            reasonType: request.reason.join(', '), // Concatena os motivos
            tutorDescription:
              request.additionalInfo || 'Sem informações adicionais',
            availableSchedules: this.getAvailableSchedules(
              request.preferredDates
            ),
          })
        );
        console.log(this.lessonRequests);
      }

      // se o usuário é um tutor, obtenho os níveis de educação múltiplos
      // else if (userData?.role === UserType.TUTOR) {
      //   const tutorData = await this.tutorService.getTutorById(userData.id);
      //   console.log('Dados do tutor carregados com sucesso', tutorData);

      //   if (tutorData?.educationLevels?.length) {
      //     // Usando diretamente os níveis de educação retornados pela API
      //     const userLevels = tutorData.educationLevels.map(
      //       (level: { levelType: any }) => level.levelType
      //     );
      //     this.educationLevel = userLevels.join(', ') || 'Não definido';
      //     console.log(
      //       'Nível de ensino do usuário carregado com sucesso:',
      //       this.educationLevel
      //     );
      //   }
      // }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário', error);
    }
  }
}
