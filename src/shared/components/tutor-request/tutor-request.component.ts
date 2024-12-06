import { Component, OnInit } from '@angular/core';
import { LessonRequestService } from 'src/shared/providers/lesson-request.service';
import { ILessonRequest } from 'src/shared/interfaces/lesson-request.interface';
import { LoadingService } from 'src/shared/providers/loading.service';
import { AuthService } from 'src/shared/providers/auth.service';
import { TutorService } from 'src/shared/providers/tutor.service';
import { ISubjects } from 'src/shared/interfaces/ITutorPersonalData.interface';
import { DialogService } from 'src/shared/providers/dialog.service';

@Component({
  selector: 'app-tutor-request',
  templateUrl: './tutor-request.component.html',
  styleUrls: ['./tutor-request.component.scss'],
})
export class TutorRequestComponent implements OnInit {
  pendingRequests: ILessonRequest[] = [];
  isLoading: boolean = true;
  messageUnavailable: string = '';
  tutorSubjects: string[] = [];
  selectedDates: { [key: number]: string } = {};

  constructor(
    private lessonRequestService: LessonRequestService,
    private authService: AuthService,
    private tutorService: TutorService,
    public loadingService: LoadingService,
    private readonly dialogService: DialogService
  ) {}

  public ngOnInit(): void {
    this.fetchPendingRequests();
  }

  /**
   * A função mostra cards com as aulas que alunos pediram e que ainda estão esperando aprovação
   * @returns Retorna todos os pedidos de alunos que estão pendentes e relacionados ao tutor
   */
  public async fetchPendingRequests(): Promise<void> {
    this.loadingService.show();
    try {
      const currentUser  = await this.authService.getCurrentUser();
      if (!currentUser ) {
        this.messageUnavailable = "Usuário não encontrado";
        return;
      }
  
      const tutorData = await this.tutorService.getTutorById(currentUser.id);
      this.tutorSubjects = tutorData.subjects.map((subject: ISubjects) => subject.subjectName);
  
      const allRequests = await this.lessonRequestService.getLessonRequests(currentUser.id, 'pendente', true, 1, 10, 'ASC', 'classId');
      this.pendingRequests = allRequests.filter(
        (request) => this.tutorSubjects.includes(request.subject.subjectName)
      );

      if (this.pendingRequests.length === 0) {
        this.messageUnavailable = "No momento, não há pedidos disponíveis que coincidem com a sua preferência.";
      }
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      this.messageUnavailable = "Erro ao carregar pedidos";
    } finally {
      this.loadingService.hide();
    }
  }

  /**
   * Seleciona uma data preferida para um pedido de aula
   * @param requestId O ID do pedido de aula
   * @param dateIndex O índice da data escolhida na lista de datas preferidas
   */
  public onDateSelect(requestId: number, dateIndex: number): void {
    const request = this.pendingRequests.find(r => r.classId === requestId);
    if (request) {
      this.selectedDates[requestId] = request.preferredDates[dateIndex];
    }
  }

  /**
   * Aceita um pedido de aula, vinculando-o ao tutor atual e à data selecionada.
   * @param request O pedido de aula a ser aceito
   */
  public async acceptRequest(request: ILessonRequest): Promise<void> {
    this.loadingService.show();
    try {

      const selectedDate = this.selectedDates[request.classId];
      if (!selectedDate) {
        return;
      }

      const currentUser = await this.authService.getCurrentUser();
      if (!currentUser) {
        this.messageUnavailable = "Usuário não encontrado";
        return;
      }

      const acceptLessonData = {
        lessonId: request.classId,
        id: currentUser.id,
        chosenDate: selectedDate
      };

      await this.lessonRequestService.updateTutorAcceptLesson(acceptLessonData);
      this.pendingRequests = this.pendingRequests.filter(r => r.classId !== request.classId);
      delete this.selectedDates[request.classId];

      if (this.pendingRequests.length === 0) {
        this.messageUnavailable = "No momento, não há pedidos disponíveis que coincidem com a sua preferência.";
      }

      return this.showMessage('Aula aceita com sucesso!');
    } catch (error) {
      console.error('Erro ao aceitar o pedido:', error);
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