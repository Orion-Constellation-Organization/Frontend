import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  /**
   * Indica se o carregamento está ativo.
   * @default false
   */
  private loading = false;

  /**
   * Checks the current loading state
   * @returns 'true' if loading is active, otherwise 'false'
   */
  public isLoading(): boolean {
    return this.loading;
  }

  /**
   * Activates the loading state
   * Sets the 'loading' variable to 'true', indicating a loading process is in progress
   */
  public show(): void {
    this.loading = true;
  }

  /**
   * Deactivates the loading state
   * Sets the 'loading' variable to 'false', indicating that the loading process is complete
   */
  public hide(): void {
    this.loading = false;
  }
}
