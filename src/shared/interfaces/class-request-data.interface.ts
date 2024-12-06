/**
 * Interface que representa os dados de uma solicitação de aula.
 * * @interface IClassRequest
 */
export interface IRequestData {
  /**
   * ID da aula.
   */
  classId?: number;

  /**
   * Tipo de razão para a solicitação.
   */
  reasonType?: string;

  /**
   * Horários disponíveis para a aula.
   */
  availableSchedules?: string[];

  /**
   * ID do assunto relacionado à disciplina.
   */
  subjectId?: number;

  /**
   * Descrição para o tutor.
   */
  tutorDescription?: string;
}
