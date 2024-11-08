/**
 * Interface base que representa dados comuns de usuários na resposta da API
 */
export interface IBaseUserResponse {
  /** ID único do usuário */
  id: number;
  /** Nome completo do usuário */
  fullName: string;
  /** Nome de usuário */
  username: string;
  /** Endereço de email */
  email: string;
  /** Data de nascimento */
  birthDate: string;
  /** Array com os IDs dos níveis de educação */
  educationLevelIds: number[];
}
