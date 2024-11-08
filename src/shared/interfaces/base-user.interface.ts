/**
 * Interface base para usuários do sistema.
 *
 * @interface
 */
export interface IBaseUser {
  /**
   * Nome completo do usuário.
   *
   * @type {string}
   */
  fullName: string;

  /**
   * Nome de usuário/social.
   *
   * @type {string}
   */
  username: string;

  /**
   * Data de nascimento.
   *
   * @type {string}
   */
  birthDate: string;

  /**
   * Endereço de e-mail.
   *
   * @type {string}
   */
  email: string;

  /**
   * Senha do usuário.
   *
   * @type {string}
   */
  password: string;

  /**
   * Confirmação da senha.
   *
   * @type {string}
   */
  confirmPassword: string;
}
