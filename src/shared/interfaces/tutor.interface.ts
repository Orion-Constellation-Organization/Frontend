/**
 * Representa os dados necessários para criar um novo tutor.
 *
 * @interface
 */
export interface ICreateTutor {
  /**
   * Nome completo do tutor.
   *
   * @type {string}
   */
  fullName: string;

  /**
   * Nome de usuário/social do tutor.
   *
   * @type {string}
   */
  username: string;

  /**
   * Endereço de e-mail do tutor.
   *
   * @type {string}
   */
  email: string;

  /**
   * Data de nascimento do tutor.
   *
   * @type {string}
   */
  birthDate: string;

  /**
   * CPF do tutor.
   *
   * @type {string}
   */
  cpf: string;

  /**
   * Lista de IDs dos níveis educacionais do tutor.
   *
   * @type {Array<number>}
   */
  educationLevelIds: Array<number>;

  /**
   * Senha do tutor.
   *
   * @type {string}
   */
  password: string;

  /**
   * Confirmação da senha do tutor.
   *
   * @type {string}
   */
  confirmPassword: string;
}
