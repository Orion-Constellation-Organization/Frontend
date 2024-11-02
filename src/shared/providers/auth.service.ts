import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

/**
 * Serviço de autenticação que estende as funcionalidades do serviço base.
 *
 * @service
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Método para realizar o login do usuário.
 *
 * @param {Object} payload - Dados de login do usuário.
 * @param {string} payload.email - Email do usuário.
 * @param {string} payload.password - Senha do usuário.
 * @returns {Promise<any>} Promessa com a resposta da requisição de login.
 */
export class AuthService extends BaseService {
  async login(payload: { email: string; password: string }) {
    return this.call('POST', 'login', payload);
  }
}
