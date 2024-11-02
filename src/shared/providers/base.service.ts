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
   * Método genérico para realizar requisições HTTP.
   *
   * @param {string} method - Método HTTP (GET, POST, PUT, DELETE, etc.).
   * @param {string} endpoint - Endpoint da API a ser acessado.
   * @param {any} [body] - Corpo da requisição.
   * @returns {Promise<T>} Promessa com a resposta da requisição.
   */
  protected call<T>(method: string, endpoint: string, body?: any): Promise<T> {
    const url = `${this.serverUrl}/${endpoint}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

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
    let errorMessage = 'Ocorreu um erro desconhecido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      errorMessage = `Código do erro: ${error.status}, mensagem: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
