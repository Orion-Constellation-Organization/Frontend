import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ILessonRequest } from '../interfaces/lesson-request.interface';
import { IClassRequest } from '../interfaces/class-request.interface';

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
  async getLessonRequests(
    status: string,
    id: number,
    filtered: boolean,
    page: number,
    size: number,
    order: 'ASC' | 'DESC',
    orderBy: string
  ): Promise<ILessonRequest[]> {
    const params = new URLSearchParams({
      status: status,
      id: String(id),
      filtered: String(filtered),
      page: String(page),
      size: String(size),
      order: order,
      orderBy: orderBy,
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
  async deleteLessonRequest(id: number): Promise<void> {
    return this.call('DELETE', `/lessonrequest/${id}`);
  }

  /**
   * Atualiza uma solicitação de aula existente
   * @param id - ID da solicitação a ser atualizada
   * @param request - Dados atualizados da solicitação
   * @returns Promise com a resposta da atualização
   */
  async updateLessonRequest(
    id: number,
    request: IClassRequest
  ): Promise<IClassRequest> {
    return this.call('PATCH', `/lessonrequest/${id}`, request);
  }

  /**
   * Confirma uma aula com um tutor específico
   * @param lessonId - ID da aula a ser confirmada
   * @param tutorId - ID do tutor selecionado
   * @returns Promise com a resposta da confirmação
   */
  public confirmLessonWithTutor(
    lessonId: number,
    tutorId: number
  ): Promise<any> {
    const payload = {
      lessonId: Number(lessonId),
      tutorId: Number(tutorId),
    };

    return this.call('PATCH', '/student-confirm-lesson', payload);
  }
}
