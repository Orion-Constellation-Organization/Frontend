import { IClassRequest } from './class-request.interface';

export interface ILessonRequest extends IClassRequest {
  ClassId: number;
  status: string;
  subject: {
    subjectId: number;
    subjectName: string;
  };
  student: any | null;
  tutors: any | null;
}
