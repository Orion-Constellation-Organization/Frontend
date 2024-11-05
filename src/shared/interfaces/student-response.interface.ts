/**
 * Interface que representa a resposta da API para dados de um estudante.
 */
export interface IStudentResponse {
  /** ID único do estudante */
  id: number;
  /** Nome completo do estudante */
  fullName: string;
  /** Nome de usuário do estudante */
  username: string;
  /** Endereço de email do estudante */
  email: string;
  /** Data de nascimento do estudante */
  birthDate: string;
  /** Array com os IDs dos níveis de educação do estudante */
  educationLevelIds: number[];
}
