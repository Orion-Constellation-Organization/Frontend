import { IClassRequest } from './class-request.interface';
import { IStudentResponse } from './student-response.interface';
import { ITutorResponse } from './tutor-response.interface';

/**
 * Representa um pedido de aula.
 * @interface ILessonRequest
 * @extends IClassRequest
 */
export interface ILessonRequest extends IClassRequest {
  /** ID da classe associada ao pedido de aula */
  ClassId: number;

  reason: string[];

  preferredDates: string[];

  /** Status do pedido de aula */
  status: string;

  urlMeet: string | null;

  additionalInfo: string;

  lessonRequestTutors: {
    id: number;
    chosenDate: string;
    status: string;
    tutor: {
      id: number;
      username: string;
      expertise: string;
      projectReason: string;
    };
  }[];

  /** Informações sobre a disciplina */
  subject: {
    /** ID da disciplina */
    subjectId: number;

    /** Nome da disciplina */
    subjectName: string;
  };

  /** Estudante associado ao pedido, pode ser nulo */
  student: IStudentResponse | null;

  /** Tutores associados ao pedido, pode ser nulo */
  tutors: ITutorResponse | null;
}
