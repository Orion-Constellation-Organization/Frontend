import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from 'src/shared/providers/auth.service';
import { UserType } from 'src/utils/enum/userType.enum';
import { StudentService } from 'src/shared/providers/student.service';
import { Reason, ReasonLabel } from 'src/utils/enum/reason.enum';
import { EnvironmentButton } from 'src/utils/enum/environmentButton.enum';
/**
 * Componente para gerenciar cards de solicitações de aula.
 */
@Component({
  selector: 'app-lesson-card-manager',
  templateUrl: './lesson-card-manager.component.html',
  styleUrls: ['./lesson-card-manager.component.scss'],
})
export class LessonCardManagerComponent implements OnInit {
  /**
   * Nome do usuário.
   */
  @Input() userName: string = '';

  /**
   * Nível de educação do usuário.
   */
  @Input() educationLevel: string = '';

  /**
   * Solicitações de aula do usuário.
   */
  @Input() lessonRequests: any[] = [];

  /**
   * Botão para editar a solicitação.
   */
  editRequest = EnvironmentButton.EDIT;

  /**
   * Botão para deletar a solicitação.
   */
  deleteRequest = EnvironmentButton.DELETE;

  /**
   * Indica se o formulário de edição deve ser exibido.
   */
  showEditForm = false;

  /**
   * Solicitação selecionada para edição.
   */
  selectedRequest: any = null;

  /**
   * Mensagem de erro.
   */
  errorMessage: string | null = null;

  /**
   * Cria uma instância do componente LessonCardManager.
   * @param authService - Serviço de autenticação para gerenciar usuários.
   * @param studentService - Serviço para gerenciar dados de estudantes.
   * @param cdr - Referência ao ChangeDetectorRef para detectar mudanças no componente.
   */
  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Método de ciclo de vida que é chamado após a inicialização do componente.
   * Carrega os dados do usuário logado.
   */
  ngOnInit(): void {
    this.loadUserData();
  }

  /**
   * Retorna até três horários ou todos, se houver menos de três.
   * @param preferredDates - Datas preferidas.
   * @returns Horários disponíveis.
   */
  getAvailableSchedules(preferredDates: string[]): string[] {
    return preferredDates.length > 3
      ? preferredDates.slice(0, 3)
      : preferredDates;
  }

  /**
   * Carrega os dados do usuário logado.
   * @returns Promise<void>
   */
  private async loadUserData(): Promise<void> {
    try {
      this.errorMessage = null;
      // obter os dados do usuário logado
      const userData = await this.authService.getCurrentUser();

      // obter o nome do usuário logado
      this.userName = userData?.username || 'Usuário não identificado';

      // depois, obtenho os dados completos do usuário
      if (userData?.role === UserType.STUDENT) {
        const studentData = await this.studentService.getStudentById(
          userData.id
        );

        // se o usuário é um estudante, obtenho o nível de educação individual
        if (studentData?.educationLevel?.levelType) {
          this.educationLevel = studentData.educationLevel.levelType;
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
              if (!dateString) return 'Ocorreu um erro ao formatar a data';

              // Verifica se já está no formato desejado
              if (dateString.includes(' às ')) {
                return dateString;
              }

              // Parse da data em formato ISO ou outro formato
              const [datePart, timePart] = dateString.split(' ');
              const date = new Date(datePart);

              if (isNaN(date.getTime())) {
                console.warn('Data inválida:', dateString);
                return 'Ocorreu um erro ao formatar a data';
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
              return 'Ocorreu um erro ao formatar a data';
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
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário', error);
      this.errorMessage = 'Erro ao carregar dados do usuário';
    }
  }

  /**
   * Manipula o clique no botão de edição.
   * @param request - Solicitação a ser editada.
   */
  onEditClick(request: any): void {
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

  /**
   * Abre o formulário de edição.
   * @param request - Solicitação a ser editada.
   */
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

      this.showEditForm = true;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Erro ao preparar dados para edição:', error);
    }
  }

  /**
   * Fecha o formulário de edição.
   * @param result - Resultado da edição.
   */
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
