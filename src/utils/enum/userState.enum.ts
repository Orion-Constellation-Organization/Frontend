/**
 * Enum que define os estados possíveis para o fluxo de autenticação de usuário.
 * Utilizado para determinar o estado atual do componente de autenticação, como login
 * ou diferentes estágios de cadastro.
 *
 * @enum {string}
 */
export enum userState {
  /**
   * Estado de login padrão.
   */
  login = 'login',

  /**
   * Estado de cadastro inicial.
   */
  signUp = 'signUp',

  /**
   * Estado de cadastro para estudantes.
   */
  studentSignUp = 'studentSignUp',

  /**
   * Estado de cadastro para tutores.
   */
  tutorSignUp = 'tutorSignUp',
}
