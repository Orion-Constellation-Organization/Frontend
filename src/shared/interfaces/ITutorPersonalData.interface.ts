import { ILessonRequest } from "./lesson-request.interface";

export interface ITutorPersonalData {
    id: number;
    username: string;
    birthDate: string;
    expertise: string;
    projectReason: string;
    lessonRequestTutors: ILessonRequestTutors[];
    subjects: ISubjects[];
}

export interface ISubjects {
    id: number;
    name: string;
}

export interface ILessonRequestTutors {
    lessonRequestId: number;
    chosenDate: string;
    lessonRequest: ILessonRequest;
}