import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { IAuthResponse } from '../interfaces/auth-response.interface';

/**
 * Serviço de autenticação que estende as funcionalidades do serviço base.
 */
@Injectable({
  providedIn: 'root',
})
/**
 * Realiza o login do usuário.
 *
 * @param payload - Dados de login do usuário
 * @param payload.email - Email do usuário
 * @param payload.password - Senha do usuário
 * @returns Promessa com a resposta da autenticação
 */
export class AuthService extends BaseService {
  async login(payload: {
    email: string;
    password: string;
  }): Promise<IAuthResponse> {
    return this.call('POST', 'login', payload);
  }
}
