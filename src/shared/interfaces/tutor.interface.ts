import { IBaseUser } from './base-user.interface';

/**
 * Representa os dados necessários para criar um novo tutor.
 *
 * @interface
 */
export interface ICreateTutor extends IBaseUser {
  /**
   * CPF do tutor.
   *
   * @type {string}
   */
  cpf: string;

  /**
   * Lista de IDs dos níveis educacionais.
   *
   * @type {Array<number>}
   */
  educationLevelIds: Array<number>;
}
