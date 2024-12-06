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

  /** Motivo do pedido de aula */
  reason: string[];

  /** Datas preferenciais para a aula */
  preferredDates: string[];

  /** Status do pedido de aula */
  status: string;

  /** URL da reunião, se aplicável */
  urlMeet: string | null;

  /** Informações adicionais sobre o pedido */
  additionalInfo: string;

  /** Tutores associados ao pedido de aula */
  lessonRequestTutors: {
    /** ID do tutor */
    id: number;

    /** Data escolhida para a aula */
    chosenDate: string;

    /** Status do tutor no pedido */
    status: string;

    /** Informações do tutor */
    tutor: {
      /** ID do tutor */
      id: number;

      /** Nome de usuário do tutor */
      username: string;

      /** Especialização do tutor */
      expertise: string;

      /** Motivo do projeto do tutor */
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

/**
 * Representa os dados de um pedido de aula.
 * @interface ILessonRequestData
 */
export interface ILessonRequestData {
  /** ID da classe associada ao pedido */
  classId: number;

  /** Nome do usuário que fez o pedido */
  userName: string;

  /** Nível de ensino do estudante */
  educationLevel: string;

  /** Matéria do pedido */
  subject: string;

  /** Tipo de motivo do pedido */
  reasonType: string;

  /** Descrição do tutor */
  tutorDescription: string;

  /** Horários disponíveis para a aula */
  availableSchedules: string[];

  /** Status do pedido */
  status: string;
}
