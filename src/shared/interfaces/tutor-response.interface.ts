/**
 * Interface que representa a resposta da API para dados de um tutor.
 */
export interface ITutorResponse {
  /** ID único do tutor */
  id: number;
  /** Nome completo do tutor */
  fullName: string;
  /** Nome de usuário do tutor */
  username: string;
  /** Endereço de email do tutor */
  email: string;
  /** Data de nascimento do tutor */
  birthDate: string;
  /** CPF do tutor */
  cpf: string;
  /** Array com os IDs dos níveis de educação que o tutor está habilitado */
  educationLevelIds: number[];
}
