import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ISubject } from '../interfaces/subject.interface';

/**
 * Serviço responsável por gerenciar operações relacionadas a disciplinas/matérias
 * @extends BaseService
 */
@Injectable({
  providedIn: 'root',
})
export class SubjectService extends BaseService {
  /**
   * Obtém a lista de todas as disciplinas/matérias disponíveis
   * @returns {Promise<ISubject[]>} Uma Promise contendo um array de disciplinas
   * @throws {Error} Pode lançar um erro se a requisição falhar
   */
  async getSubjects(): Promise<ISubject[]> {
    return this.call<ISubject[]>('GET', 'get/subject');
  }
}
