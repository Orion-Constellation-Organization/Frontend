import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
    serverUrl: string;

    constructor(public http: HttpClient) {
        this.serverUrl = 'https://3300-2804-14d-5cd5-945c-2da5-54b6-372b-3acd.ngrok-free.app/api';
    }

  async login(payload: { email: string; password: string }) { // Retorna um JWS TOken Novo
    return firstValueFrom(this.http.post(`${this.serverUrl}/login`, payload));
  }
}