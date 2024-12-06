import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ILessonRequest } from '../interfaces/lesson-request.interface';
import { IClassRequest } from '../interfaces/class-request.interface';
import { ITutorAcceptLesson } from '../interfaces/ITutorAcceptLesson.interface';
import { ILessonRequestTutorReject } from '../interfaces/ILessonRequestTutorReject.interface';

/**
 * Serviço responsável por gerenciar operações relacionadas a solicitações de aulas
 * @extends BaseService
 */
@Injectable({
  providedIn: 'root',
})
export class LessonRequestService extends BaseService {
  /**
   * Obtém a lista de todas as solicitações de aula.
   * @returns Promise contendo um array de solicitações de aula
   */
  async getLessonRequests(id: number, status: string, filtered: boolean, page: number, size: number, order: 'ASC' | 'DESC', orderBy: 'classId'): Promise<ILessonRequest[]> {
    const params = new URLSearchParams({
      id: String(id),
      status: status,
      filtered: String(filtered),
      page: String(page),
      size: String(size),
      order: order,
      orderBy: orderBy
    });
  
    return this.call('GET', `/lessonrequest?${params.toString()}`);
  }

  /**
   * Busca uma solicitação de aula específica pelo seu ID.
   * @param id - O identificador único da solicitação de aula
   * @returns Promise com os dados da solicitação de aula encontrada
   */
  async getLessonRequestById(id: number): Promise<ILessonRequest> {
    return this.call('GET', `/lessonrequest/${id}`);
  }

  /**
   * Deleta uma solicitação de aula pelo ID
   * @param id - ID da solicitação a ser deletada
   * @returns Promise com a resposta da deleção
   */
  async deleteLessonRequest(id: number, classId: number): Promise<void> {
    const payload = {
      id,
      classId,
    };
    return this.call('DELETE', '/lessonrequest', payload);
  }

  /**
   * Atualiza uma solicitação de aula existente
   * @param id - ID da solicitação a ser atualizada
   * @param request - Dados atualizados da solicitação
   * @returns Promise com a resposta da atualização
   */
  async updateLessonRequest(
    userId: number,
    lessonId: number,
    request: IClassRequest
  ): Promise<IClassRequest> {
    const params = new URLSearchParams({
      lessonId: String(lessonId),
      id: String(userId),
    });

    return this.call(
      'PATCH',
      `/lessonrequest/${lessonId}?${params.toString()}`,
      request
    );
  }

  /**
   * Confirma uma aula com um tutor específico
   * @param lessonId - ID da aula a ser confirmada
   * @param tutorId - ID do tutor selecionado
   * @returns Promise com a resposta da confirmação
   */
  public confirmLessonWithTutor(
    lessonId: number,
    userId: number
  ): Promise<any> {
    const payload = {
      lessonId: Number(lessonId),
      id: Number(userId),
    };

    return this.call('POST', '/student-confirm-lesson', payload);
  }

  public async updateTutorAcceptLesson(data: ITutorAcceptLesson): Promise<ITutorAcceptLesson> {
    return this.call('PATCH', '/tutor-accept-lesson', data)
  }

  /**
   * Recusa uma solicitação de aula
   * @param lessonRequestId - ID da solicitação de aula
   * @param tutorId - ID do tutor
   * @returns Promise com a resposta da recusa
   */
  public async rejectLessonRequest(lessonRequestId: number, tutorId: number): Promise<ILessonRequestTutorReject> {
    const payload = {
      lessonRequestId,
      id: tutorId
    };
    return this.call('POST', '/lessonrequest-decline', payload);
  }
}
