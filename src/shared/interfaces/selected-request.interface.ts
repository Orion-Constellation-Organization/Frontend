/**
 * Interface que representa uma solicitação selecionada de tutoria
 * @interface ISelectedRequest
 */
export interface ISelectedRequest {
  /** ID da turma/classe */
  classId: number;

  /** Nome do usuário */
  userName: string;

  /** Nível educacional (ex: fundamental, médio, superior) */
  educationLevel: string;

  /** Nome da disciplina/matéria */
  subject: string;

  /** Tipo/motivo da solicitação */
  reasonType: string;

  /** Descrição detalhada para o tutor */
  tutorDescription: string;

  /** Lista de horários disponíveis */
  availableSchedules: string[];

  /** ID da disciplina/matéria */
  subjectId: number;

  /** ID do estudante (opcional) */
  studentId?: number;

  /** Status da solicitação (opcional) */
  status?: string;
}

/**
 * Interface que representa os dados de uma solicitação de aula
 * @interface ILessonRequestData
 */
export interface ILessonRequestData {
  /** ID da turma/classe */
  classId: number;

  /** Nome do usuário */
  userName: string;

  /** Nível educacional */
  educationLevel: string;

  /** Informações sobre a disciplina */
  subject: {
    /** Nome da disciplina */
    subjectName: string;
    /** ID da disciplina */
    subjectId: number;
  };

  /** Motivos da solicitação */
  reason: string[];

  /** Informações adicionais */
  additionalInfo: string;

  /** Datas preferidas para a aula */
  preferredDates: string[];

  /** Status da solicitação */
  status: string;

  /** ID do estudante */
  studentId: string;
}

/**
 * Interface que representa uma solicitação de aula mapeada
 * @interface IMappedLessonRequest
 */
export interface IMappedLessonRequest {
  /** ID da turma/classe */
  classId: number;

  /** Nome do usuário */
  userName: string;

  /** Nível educacional */
  educationLevel: string;

  /** Nome da disciplina */
  subject: string;

  /** Tipo/motivo da solicitação */
  reasonType: string;

  /** Descrição detalhada para o tutor */
  tutorDescription: string;

  /** Lista de horários disponíveis */
  availableSchedules: string[];

  /** ID da disciplina/matéria */
  subjectId: number;

  /** ID do estudante */
  studentId: string;

  /** Status da solicitação */
  status: string;
}
