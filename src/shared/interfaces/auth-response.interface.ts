/**
 * Interface que representa a resposta da API após autenticação.
 *
 * @interface IAuthResponse
 * @property {string} message - Mensagem retornada pela API.
 * @property {string} role - Papel do usuário autenticado.
 * @property {string} token - Token de autenticação gerado.
 */
export interface IAuthResponse {
  message: string;
  role: string;
  token: string;
}
