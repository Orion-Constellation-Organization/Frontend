import { IBaseUser } from './base-user.interface';

/**
 * Representa os dados necessários para criar um novo aluno.
 *
 * @interface
 */
export interface ICreateStudent extends IBaseUser {
  /**
   * Lista de IDs dos níveis educacionais.
   *
   * @type {number[]}
   */
  educationLevelId: number[];
}
