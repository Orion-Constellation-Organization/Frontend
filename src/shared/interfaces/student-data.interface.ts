/**
 * Interface que representa os dados de um estudante no sistema
 */
export interface IStudentData {
  /** Identificador único do estudante */
  id: number;

  /** Nome de usuário do estudante */
  username: string;

  /**
   * Informações sobre o nível educacional do estudante
   */
  educationLevel: {
    /** Tipo/categoria do nível educacional (ex: 'fundamental', 'médio', 'superior') */
    levelType: string;
  };
}
