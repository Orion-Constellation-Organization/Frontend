import { IBaseUserResponse } from './base-user-response.interface';

/**
 * Interface que representa a resposta da API para dados de um tutor
 */
export interface ITutorResponse extends IBaseUserResponse {
  /** CPF do tutor */
  cpf: string;
}
