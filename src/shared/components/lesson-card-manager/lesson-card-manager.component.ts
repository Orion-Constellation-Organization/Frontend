import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/shared/providers/auth.service';
import { UserType } from 'src/utils/enum/userType.enum';
import { StudentService } from 'src/shared/providers/student.service';
import { Reason, ReasonLabel } from 'src/utils/enum/reason.enum';
import { EnvironmentButton } from 'src/utils/enum/environmentButton.enum';
import { ClassRequestFormComponent } from '../class-request-form/class-request-form.component';

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
  showEditForm = false;
  selectedRequest: any = null;

  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  // Retorna até três horários ou todos, se houver menos de três
  getAvailableSchedules(preferredDates: string[]): string[] {
    // Garantir que todas as datas estejam no formato correto antes de retornar
    const validDates = preferredDates.filter(
      (date) => date && date.includes(' às ')
    );
    return validDates.length > 3 ? validDates.slice(0, 3) : validDates;
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
        this.lessonRequests = studentData.lessonRequests.map((request: any) => {
          const requestId = request.ClassId;

          if (!requestId) {
            console.warn('Solicitação sem ID:', request);
          }

          // Função auxiliar para formatar a data
          const formatSchedule = (dateString: string): string => {
            try {
              if (!dateString) return '';

              // Verifica se já está no formato desejado
              if (dateString.includes(' às ')) {
                return dateString;
              }

              // Parse da data em formato ISO ou outro formato
              const [datePart, timePart] = dateString.split(' ');
              const date = new Date(datePart);

              if (isNaN(date.getTime())) {
                console.warn('Data inválida:', dateString);
                return '';
              }

              // Formatar a data para dd/MM/yyyy
              const day = date.getDate().toString().padStart(2, '0');
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const year = date.getFullYear();

              // Formatar a hora (assumindo que timePart está em formato HH:mm)
              const formattedTime = timePart
                ? timePart.substring(0, 5)
                : '00:00';

              return `${day}/${month}/${year} às ${formattedTime}`;
            } catch (error) {
              console.error('Erro ao formatar data:', dateString, error);
              return '';
            }
          };

          // Formatar todos os horários disponíveis
          const formattedSchedules = Array.isArray(request.preferredDates)
            ? request.preferredDates
                .filter(Boolean)
                .map(formatSchedule)
                .filter(Boolean)
            : [];

          return {
            classId: requestId,
            userName: studentData.username,
            educationLevel: studentData.educationLevel.levelType,
            subject:
              request.subject.subjectName || 'Erro ao obter a disciplina',
            reasonType: request.reason
              .map((r: string) => ReasonLabel[r as Reason] || r)
              .join(', '),
            tutorDescription:
              request.additionalInfo || 'Sem informações adicionais',
            availableSchedules: this.getAvailableSchedules(formattedSchedules),
            subjectId: request.subject.subjectId,
            studentId: studentData.id,
          };
        });

        console.log('Requisições processadas:', this.lessonRequests);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário', error);
    }
  }

  onEditClick(request: any): void {
    console.log('Dados originais do pedido:', request);

    if (!request.classId) {
      console.error('Tentativa de edição sem ID da solicitação:', request);
      return;
    }

    // Fechar qualquer modal aberto anteriormente
    if (this.showEditForm) {
      this.showEditForm = false;
      this.selectedRequest = null;
      // Dar tempo para o componente ser destruído adequadamente
      setTimeout(() => {
        this.openEditForm(request);
      }, 100);
    } else {
      this.openEditForm(request);
    }
  }

  private openEditForm(request: any): void {
    try {
      if (!request) {
        console.error('Request inválido:', request);
        return;
      }

      // Garantir que todos os campos necessários existam
      this.selectedRequest = {
        classId: request.classId,
        userName: request.userName || 'Usuário não identificado',
        educationLevel: request.educationLevel || 'Nível não definido',
        subject: request.subject || 'Sem matéria definida',
        reasonType: request.reasonType || '',
        tutorDescription: request.tutorDescription || '',
        availableSchedules: Array.isArray(request.availableSchedules)
          ? request.availableSchedules.filter(Boolean)
          : [],
        subjectId: request.subjectId,
      };

      console.log('Dados preparados para edição:', this.selectedRequest);

      this.showEditForm = true;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Erro ao preparar dados para edição:', error);
    }
  }

  onCloseForm(result?: string): void {
    this.showEditForm = false;
    this.selectedRequest = null;
    this.cdr.detectChanges();

    if (result === 'updated') {
      setTimeout(() => {
        this.loadUserData();
      }, 100);
    }
  }
}
