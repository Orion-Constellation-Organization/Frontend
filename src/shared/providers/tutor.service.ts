import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ICreateTutor } from '../interfaces/tutor.interface';

/**
 * Serviço de gerenciamento de tutores que estende as funcionalidades do serviço base.
 *
 * @service
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Método para criar um novo tutor.
 *
 * @param {ICreateTutor} payload - Dados do tutor a ser criado.
 * @param {string} payload.fullName - Nome completo do tutor.
 * @param {string} payload.username - Nome de usuário do tutor.
 * @param {string} payload.email - Email do tutor.
 * @param {string} payload.birthDate - Data de nascimento do tutor.
 * @param {string} payload.cpf - CPF do tutor.
 * @param {Array<number>} payload.educationLevelIds - IDs dos níveis de ensino do tutor.
 * @param {string} payload.password - Senha do tutor.
 * @param {string} payload.confirmPassword - Confirmação da senha do tutor.
 * @returns {Promise<any>} Promessa com a resposta da requisição de criação do tutor.
 */
export class TutorService extends BaseService {
  async createTutor(payload: ICreateTutor) {
    return this.call('POST', 'register/tutor', payload);
  }
}
