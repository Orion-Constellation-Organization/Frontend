import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ICreateTutor } from '../interfaces/tutor.interface';
import { ITutorResponse } from '../interfaces/tutor-response.interface';

/**
 * Serviço de gerenciamento de tutores que estende as funcionalidades do serviço base.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Cria um novo tutor no sistema.
 *
 * @param payload - Dados do tutor a ser criado
 * @param payload.fullName - Nome completo do tutor
 * @param payload.username - Nome de usuário do tutor
 * @param payload.email - Email do tutor
 * @param payload.birthDate - Data de nascimento do tutor
 * @param payload.cpf - CPF do tutor
 * @param payload.educationLevelIds - IDs dos níveis de ensino do tutor
 * @param payload.password - Senha do tutor
 * @param payload.confirmPassword - Confirmação da senha do tutor
 * @returns Promessa com os dados do tutor criado
 */
export class TutorService extends BaseService {
  async createTutor(payload: ICreateTutor): Promise<ITutorResponse> {
    return this.call('POST', 'register/tutor', payload);
  }

  /**
   * Busca um tutor específico pelo seu ID.
   *
   * @param id - O identificador único do tutor
   * @returns Promessa com os dados do tutor encontrado
   */
  async getTutorById(id: number): Promise<any> {
    return this.call('GET', `get/tutor/${id}`);
  }
}
