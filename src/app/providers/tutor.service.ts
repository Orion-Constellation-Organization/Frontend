import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

interface ICreateTutor {
  fullName: string;
  username: string;
  birthDate: string;
  email: string;
  cpf: string;
  educationLevel: Array<number>;
  password: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class TutorService {
  serverUrl: string;

  constructor(public http: HttpClient) {
    this.serverUrl =
      'https://3300-2804-14d-5cd5-945c-2da5-54b6-372b-3acd.ngrok-free.app/api';
  }

  async createTutor(payload: ICreateTutor) {
    // Retorna um JWS TOken Novo
    return firstValueFrom(
      this.http.post(`${this.serverUrl}/register/tutor`, payload)
    );
  }
}
