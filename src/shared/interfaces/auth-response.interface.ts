/**
 * Interface que representa a resposta da API após autenticação.
 */
export interface IAuthResponse {
  /** Token JWT de autenticação */
  token: string;
  /** Dados do usuário autenticado */
  user: {
    /** ID único do usuário */
    id: number;
    /** Endereço de email do usuário */
    email: string;
    /** Nome completo do usuário */
    fullName: string;
    /** Nome de usuário */
    username: string;
    /** Papel/função do usuário no sistema */
    role: string;
  };
}
