/**
 * Interface que representa um nível de educação
 */
export interface IEducationLevel {
  /** ID único do nível de educação */
  educationId: number;
  /** Tipo/nome do nível de educação (tutor, student) */
  levelType: string;
}
