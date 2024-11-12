import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { ISubject } from '../interfaces/subject.interface';

@Injectable({
  providedIn: 'root',
})
export class SubjectService extends BaseService {
  async getSubjects(): Promise<ISubject[]> {
    return this.call<ISubject[]>('GET', 'get/subject');
  }
}
