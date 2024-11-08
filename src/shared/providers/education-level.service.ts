import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IEducationLevel } from '../interfaces/education-level.interface';
import { BaseService } from '../providers/base.service';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';

/**
 * Serviço responsável por gerenciar operações relacionadas aos níveis de educação
 */
@Injectable({
  providedIn: 'root',
})
export class EducationLevelService {
  /** URL base da API para endpoints de nível educacional */
  private apiUrl = `${environment.urlBase}/get/educationLevel`;

  /**
   * Cria uma instância do EducationLevelService
   * @param http - Instância do HttpClient para realizar requisições HTTP
   */
  constructor(private http: HttpClient) {}

  /**
   * Obtém a lista de todos os níveis de educação disponíveis
   * @returns Observable com array de níveis de educação
   */
  getEducationLevels(): Observable<IEducationLevel[]> {
    return this.http.get<IEducationLevel[]>(this.apiUrl);
  }
}
