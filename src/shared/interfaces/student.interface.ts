import { IBaseUser } from './base-user.interface';

/**
 * Representa os dados necessários para criar um novo aluno.
 *
 * @interface
 */
export interface ICreateStudent extends IBaseUser {
  /**
   * ID do nível educacional.
   *
   * @type {number}
   */
  educationLevelId: number;
}
