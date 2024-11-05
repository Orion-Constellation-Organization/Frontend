import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IEducationLevel } from '../interfaces/education-level.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class EducationLevelService {
  private apiUrl = `${environment.urlBase}/get/educationLevel`;

  constructor(private http: HttpClient) {}

  getEducationLevels(): Observable<IEducationLevel[]> {
    return this.http.get<IEducationLevel[]>(this.apiUrl);
  }
}
