import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ICreateStudent } from '../interfaces/student.interface';
import { IStudentResponse } from '../interfaces/student-response.interface';

/**
 * Serviço de gerenciamento de estudantes que estende as funcionalidades do serviço base.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Cria um novo estudante no sistema.
 *
 * @param payload - Dados do estudante a ser criado
 * @param payload.fullName - Nome completo do estudante
 * @param payload.username - Nome de usuário do estudante
 * @param payload.email - Email do estudante
 * @param payload.birthDate - Data de nascimento do estudante
 * @param payload.educationLevelId - IDs dos níveis de ensino do estudante
 * @param payload.password - Senha do estudante
 * @param payload.confirmPassword - Confirmação da senha do estudante
 * @returns Promessa com os dados do estudante criado
 */
export class StudentService extends BaseService {
  async createStudent(payload: ICreateStudent): Promise<IStudentResponse> {
    return this.call('POST', 'register/student', payload);
  }
}
