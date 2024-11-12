import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment.development';

/**
 * Serviço base para realizar requisições HTTP.
 *
 * @service
 * @description Este serviço utiliza a URL base configurada no arquivo de ambiente.
 * A URL base pode ser alterada dependendo do ambiente em que a aplicação está sendo executada,
 * como desenvolvimento ou produção, por meio do arquivo environment.ts e environment.prod.ts.
 */
@Injectable({
  providedIn: 'root',
})
export class BaseService {
  /**
   * URL base do servidor para requisições via API.
   *
   * @type {string}
   * @default 'http://localhost:4444/api' em desenvolvimento.
   */
  protected serverUrl: string = environment.urlBase;

  /**
   * Construtor do serviço base, que recebe o cliente HTTP.
   *
   * @param {HttpClient} http - Cliente HTTP para realizar requisições.
   */
  constructor(protected http: HttpClient) {}

  /**
   * Realiza uma requisição HTTP genérica utilizando o método especificado.
   *
   * @template T - Tipo genérico que representa o formato da resposta esperada
   * @param {string} method - Método HTTP a ser utilizado (GET, POST, PUT, DELETE, etc.)
   * @param {string} endpoint - Caminho relativo do endpoint da API (será concatenado com a URL base)
   * @param {any} [body] - Dados opcionais a serem enviados no corpo da requisição
   * @throws {Error} Lança um erro se a requisição falhar
   * @returns {Promise<T>} Promise que resolve com a resposta da API do tipo T
   */
  protected call<T>(method: string, endpoint: string, body?: any): Promise<T> {
    const url = `${this.serverUrl}/${endpoint}`;
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      ...(token && { Authorization: `Bearer ${token}` }),
    });

    return firstValueFrom(
      this.http
        .request<T>(method, url, { body, headers })
        .pipe(map(this.handleResponse), catchError(this.handleError))
    );
  }

  /**
   * Tratamento de resposta bem-sucedida.
   *
   * @param {T} response - Resposta da requisição.
   * @returns {T} A resposta processada.
   */
  protected handleResponse<T>(response: T): T {
    return response;
  }

  /**
   * Tratamento de erros durante requisições HTTP.
   *
   * @param {HttpErrorResponse} error - Erro retornado pela requisição.
   * @returns {Observable<never>} Um Observable com a mensagem de erro.
   */
  protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Erro do cliente
      return throwError(() => error);
    } else {
      // Erro da API - retorna o erro original
      return throwError(() => error);
    }
  }
}
