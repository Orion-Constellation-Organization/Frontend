import { ILessonRequest } from './lesson-request.interface';

/**
 * Interface que representa os dados pessoais de um tutor
 */
export interface ITutorPersonalData {
  /** ID único do tutor */
  id: number;
  /** Nome de usuário do tutor */
  username: string;
  /** Data de nascimento do tutor no formato string */
  birthDate: string;
  /** Área de especialização do tutor */
  expertise: string;
  /** Motivo pelo qual o tutor quer participar do projeto */
  projectReason: string;
  /** Lista de solicitações de aulas associadas ao tutor */
  lessonRequestTutors: ILessonRequestTutors[];
  /** Lista de disciplinas que o tutor pode lecionar */
  subjects: ISubjects[];
}

/**
 * Interface que representa uma disciplina
 */
export interface ISubjects {
  /** ID único da disciplina */
  id: number;
  /** Nome da disciplina */
  name: string;
  /** ID da disciplina */
  subjectId: number;
  /** Nome da disciplina */
  subjectName: string;
}

/**
 * Interface que representa a relação entre um tutor e uma solicitação de aula
 */
export interface ILessonRequestTutors {
  /** ID da solicitação de aula */
  lessonRequestId: number;
  /** Data escolhida para a aula */
  chosenDate: string;
  /** Dados da solicitação de aula */
  lessonRequest: ILessonRequest;
}

/**
 * Interface que representa os dados básicos de um tutor
 */
export interface ITutorData {
  /** ID único do tutor */
  id: string;
  /** URL da foto do perfil do tutor */
  photoUrl?: string;
  /** Nome de usuário do tutor */
  username?: string;
  /** Data de nascimento do tutor */
  birthDate?: string;
  /** Área de especialização do tutor */
  expertise?: string;
  /** Motivo pelo qual o tutor quer participar do projeto */
  projectReason?: string;
  /** Data escolhida para a aula */
  chosenDate?: string;
}

export interface ITutorPersonalModal {
    username: string;
    expertise: string;
    projectReason: string;
    selectedSubjects: string[];
}
