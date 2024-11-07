/**
 * Interface que representa a resposta da API após autenticação.
 */
export interface IAuthResponse {
  message: string;
  role: string;
  token: string;
}
