import { Component, OnInit } from '@angular/core';
import { LessonRequestService } from 'src/shared/providers/lesson-request.service';
import { ILessonRequest } from 'src/shared/interfaces/lesson-request.interface';
import { LoadingService } from 'src/shared/providers/loading.service';
import { AuthService } from 'src/shared/providers/auth.service';

@Component({
  selector: 'app-tutor-request',
  templateUrl: './tutor-request.component.html',
  styleUrls: ['./tutor-request.component.scss'],
})
export class TutorRequestComponent implements OnInit {
  pendingRequests: ILessonRequest[] = [];
  isLoading: boolean = true;
  messageUnavailable: string = '';

  constructor(
    private lessonRequestService: LessonRequestService,
    private authService: AuthService,
    private loadingService: LoadingService
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
    this.isLoading = true;
    try {
      const currentUser  = await this.authService.getCurrentUser();
      if (!currentUser ) {
        this.messageUnavailable = "Usuário não encontrado"
        return;
      }
  
      const userId = currentUser.id;
      const allRequests = await this.lessonRequestService.getLessonRequests(userId, true, 1, 10, 'ASC');
      console.log(allRequests);
      this.pendingRequests = allRequests.filter(
        (request) => request.status === 'pendente'
      );
    } catch (error: any) {
      if (error.status === 404) {
        this.messageUnavailable = "No momento, não há pedidos disponíveis que coincidem com a sua preferência.";
      }
    } finally {
      this.loadingService.hide();
      this.isLoading = false;
    }
  }
}
