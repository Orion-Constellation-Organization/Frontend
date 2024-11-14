import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { IClassRequest } from '../interfaces/class-request.interface';

/**
 * Serviço responsável por gerenciar requisições relacionadas a solicitações de aulas
 * @extends BaseService
 */
@Injectable({
  providedIn: 'root',
})
export class ClassRequestService extends BaseService {
  /**
   * Cria uma nova solicitação de aula
   * @param request - Objeto contendo os dados da solicitação de aula
   * @returns Promise que resolve com a resposta da criação da solicitação
   */
  async createClassRequest(request: IClassRequest): Promise<any> {
    return this.call<any>('POST', 'register/lessonrequest', request);
  }
}
