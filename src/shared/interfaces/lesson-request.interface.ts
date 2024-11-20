import { IClassRequest } from './class-request.interface';

/**
 * Representa um pedido de aula.
 * @interface ILessonRequest
 * @extends IClassRequest
 */
export interface ILessonRequest extends IClassRequest {
  /** ID da classe associada ao pedido de aula */
  ClassId: number;

  /** Status do pedido de aula */
  status: string;

  /** Informações sobre a disciplina */
  subject: {
    /** ID da disciplina */
    subjectId: number;

    /** Nome da disciplina */
    subjectName: string;
  };

  /** Estudante associado ao pedido, pode ser nulo */
  student: any | null;

  /** Tutores associados ao pedido, pode ser nulo */
  tutors: any | null;
}
