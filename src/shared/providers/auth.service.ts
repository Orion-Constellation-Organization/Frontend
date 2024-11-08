import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IAuthResponse } from '../interfaces/auth-response.interface';
import { environment } from 'src/environments/environment.development';
import { UserType } from 'src/utils/enum/userType.enum';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../interfaces/decoded-token.interface';

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
 * @param payload.userType - Tipo de usuário
 * @returns Promessa com a resposta da autenticação
 */
export class AuthService {
  private readonly USER_KEY = 'currentUser';
  private readonly TOKEN_KEY = 'authToken';

  constructor(private http: HttpClient) {}

  async login(credentials: {
    email: string;
    password: string;
    userType: UserType;
  }) {
    try {
      const response = await this.http
        .post<IAuthResponse>(`${environment.urlBase}/login`, {
          email: credentials.email,
          password: credentials.password,
          role: credentials.userType,
        })
        .toPromise();

      if (!response) {
        throw new Error('Resposta inválida do servidor');
      }

      if (response.role !== credentials.userType) {
        throw new Error(
          `Usuário não autorizado para login como ${credentials.userType}`
        );
      }

      const decodedToken = jwtDecode<DecodedToken>(response.token);
      if (decodedToken.role !== credentials.userType) {
        throw new Error(`Tipo de usuário inválido no token`);
      }

      this.setUserData(response);
      return response;
    } catch (error) {
      console.error('Erro no login:', error);
      throw new Error('Tipo de usuário não autorizado para este login');
    }
  }

  /**
   * Armazena os dados do usuário no localStorage
   */
  private setUserData(response: IAuthResponse) {
    const user = {
      role: response.role,
    };

    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, response.token);
  }

  /**
   * Recupera os dados do usuário atual
   */
  async getCurrentUser() {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const decodedToken = this.getDecodedToken();

    if (!decodedToken || !token) {
      console.warn('Token não encontrado ou inválido');
      return null;
    }

    try {
      // Define a rota baseada no role do usuário
      let endpoint = '';
      switch (decodedToken.role) {
        case UserType.TUTOR:
          endpoint = `${environment.urlBase}/get/tutor/${decodedToken.id}`;
          break;
        case UserType.STUDENT:
          endpoint = `${environment.urlBase}/get/student/${decodedToken.id}`;
          break;
        default:
          throw new Error('Tipo de usuário não reconhecido');
      }

      // Adiciona o header de autorização
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await this.http
        .get<any>(endpoint, { headers })
        .toPromise();

      if (!response || !response.username) {
        console.warn('Resposta da API inválida:', response);
        return null;
      }

      return {
        id: decodedToken.id,
        email: decodedToken.email,
        role: decodedToken.role,
        username: response.username,
      };
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      return null;
    }
  }

  /**
   * Realiza o logout do usuário
   */
  logout() {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Verifica se existe um usuário logado
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY); // Correção: verificar token diretamente
  }

  getDecodedToken(): DecodedToken | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (token) {
      try {
        return jwtDecode<DecodedToken>(token);
      } catch (error) {
        console.error('Erro ao decodificar token:', error);
        return null;
      }
    }
    return null;
  }
}
