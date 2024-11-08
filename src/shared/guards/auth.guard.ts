import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../providers/auth.service';

/**
 * Guarda de rota para proteção de rotas autenticadas
 * @class AuthGuard
 * @implements {CanActivate}
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Verifica se o usuário pode acessar a rota
   * @param {ActivatedRouteSnapshot} route - Snapshot da rota ativa
   * @param {RouterStateSnapshot} state - Estado atual do router
   * @returns {boolean} - Retorna true se o usuário estiver autenticado, false caso contrário
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
