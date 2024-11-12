import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { IClassRequest } from '../interfaces/class-request.interface';

@Injectable({
  providedIn: 'root',
})
export class ClassRequestService extends BaseService {
  async createClassRequest(request: IClassRequest): Promise<any> {
    return this.call<any>('POST', 'register/lessonrequest', request);
  }
}
