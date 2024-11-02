import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ICreateStudent } from '../interfaces/student.interface';

/**
 * Serviço de gerenciamento de estudantes que estende as funcionalidades do serviço base.
 *
 * @service
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Método para criar um novo estudante.
 *
 * @param {ICreateStudent} payload - Dados do estudante a ser criado.
 * @param {string} payload.fullName - Nome completo do estudante.
 * @param {string} payload.username - Nome de usuário do estudante.
 * @param {string} payload.email - Email do estudante.
 * @param {string} payload.birthDate - Data de nascimento do estudante.
 * @param {Array<number>} payload.educationLevelId - IDs dos níveis de ensino do estudante.
 * @param {string} payload.password - Senha do estudante.
 * @param {string} payload.confirmPassword - Confirmação da senha do estudante.
 * @returns {Promise<any>} Promessa com a resposta da requisição de criação do estudante.
 */
export class StudentService extends BaseService {
  async createStudent(payload: ICreateStudent) {
    return this.call('POST', 'register/student', payload);
  }
}
