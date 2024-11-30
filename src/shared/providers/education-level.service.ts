import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IEducationLevel } from '../interfaces/education-level.interface';
import { BaseService } from '../providers/base.service';

/**
 * Serviço responsável por gerenciar operações relacionadas aos níveis de educação
 * @extends BaseService
 */
@Injectable({
  providedIn: 'root',
})
export class EducationLevelService extends BaseService {
  /**
   * Cria uma instância do EducationLevelService
   * @param http - Instância do HttpClient para realizar requisições HTTP
   */
  constructor(http: HttpClient) {
    super(http);
  }

  /**
   * Obtém a lista de níveis de educação disponíveis
   * @returns Promise contendo um array de níveis de educação
   */
  getEducationLevels(): Promise<IEducationLevel[]> {
    return this.call('GET', '/educationLevel');
  }
}
