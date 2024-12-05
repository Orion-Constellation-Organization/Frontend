/**
 * Interface que representa uma solicitação de aula
 * @interface IClassRequest
 */
export interface IClassRequest {
  /** Array de motivos para a solicitação da aula */
  reason: string[];

  /** Array de datas preferidas para a aula */
  preferredDates: string[];

  /** ID da disciplina/matéria */
  subjectId: number;

  /** Informações adicionais sobre a solicitação */
  additionalInfo?: string;

  /** ID do estudante que está fazendo a solicitação */
  studentId: number;

  /** ID da solicitação */
  classId?: number;

  /** Status da solicitação */
  status?: string;

  /** ID do tutor selecionado */
  tutorId?: number;

  /** Data escolhida para a aula */
  chosenDate?: string;
}
