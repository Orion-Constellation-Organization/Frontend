import { Component, OnInit } from '@angular/core';
import { ITutorWaiting } from 'src/shared/interfaces/ITutorWaiting.interface';
import { AuthService } from 'src/shared/providers/auth.service';
import { TutorService } from 'src/shared/providers/tutor.service';
import { LoadingService } from 'src/shared/providers/loading.service';

@Component({
  selector: 'app-tutor-waiting',
  templateUrl: './tutor-waiting.component.html',
  styleUrls: ['./tutor-waiting.component.scss']
})
export class TutorWaitingComponent implements OnInit {
  waitingLessons: ITutorWaiting[] = [];
  messageUnavailable: string = '';

  constructor(
    private authService: AuthService,
    private tutorService: TutorService,
    public loadingService: LoadingService
  ) {}

  public ngOnInit(): void {
    this.fetchWaitingLessons();
  }

  /**
   * A função mostra cards com as aulas que o tutor aceitou, mas que falta confirmação do aluno
   * @returns Retorna todos as aulas que falta a confirmação do aluno
   */
  public async fetchWaitingLessons(): Promise<void> {
    this.loadingService.show();

    try {
      const currentUser = await this.authService.getCurrentUser();
      if (!currentUser) {
        this.messageUnavailable = "Usuário não encontrado";
        return;
      }

      const tutorData = await this.tutorService.getTutorById(currentUser.id);
      this.waitingLessons = tutorData.lessonRequestTutors.filter(
        (lesson: ITutorWaiting) => lesson.status === 'aceito'
      );

      if (this.waitingLessons.length === 0) {
        this.messageUnavailable = "Você não possui pedidos aguardando confirmação do aluno.";
      }
    } catch (error) {
      console.error('Erro ao buscar aulas:', error);
      this.messageUnavailable = "Erro ao carregar aulas";
    } finally {
      this.loadingService.hide();
    }
  }
}