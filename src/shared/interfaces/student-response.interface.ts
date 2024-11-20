import { IBaseUserResponse } from './base-user-response.interface';
import { IClassRequest } from './class-request.interface';

/**
 * Interface que representa a resposta da API para dados de um estudante
 */
export interface IStudentResponse extends IBaseUserResponse {
  // Herda todos os campos de IBaseUserResponse
  lessonRequests: IClassRequest[];
}
