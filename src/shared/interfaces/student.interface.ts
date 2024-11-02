/**
 * Representa os dados necessários para criar um novo aluno.
 *
 * @interface
 */
export interface ICreateStudent {
  /**
   * Nome completo do aluno.
   *
   * @type {string}
   */
  fullName: string;

  /**
   * Nome de usuário/social do aluno.
   *
   * @type {string}
   */
  username: string;

  /**
   * Data de nascimento do aluno.
   *
   * @type {string}
   */
  birthDate: string;

  /**
   * Endereço de e-mail do aluno.
   *
   * @type {string}
   */
  email: string;

  /**
   * Lista de IDs dos níveis educacionais do aluno.
   *
   * @type {Array<number>}
   */
  educationLevelId: Array<number>;

  /**
   * Senha do aluno.
   *
   * @type {string}
   */
  password: string;

  /**
   * Confirmação da senha do aluno.
   *
   * @type {string}
   */
  confirmPassword: string;
}
