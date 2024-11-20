import { IClassRequest } from './class-request.interface';

export interface ILessonRequest extends IClassRequest {
  classId: number;
}
