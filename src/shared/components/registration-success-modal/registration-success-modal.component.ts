import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Componente responsável por exibir um modal de sucesso após o registro.
 *
 * @component
 */
@Component({
  selector: 'app-registration-success-modal',
  templateUrl: './registration-success-modal.component.html',
  styleUrls: ['./registration-success-modal.component.scss'],
})
export class RegistrationSuccessModalComponent {
  /**
   * Indica se o modal está aberto ou fechado.
   *
   * @type {boolean}
   */
  @Input() isOpen = false;

  /**
   * Evento emitido quando o modal deve ser fechado.
   *
   * @type {EventEmitter<void>}
   */
  @Output() onClose = new EventEmitter<void>();

  /**
   * Fecha o modal e emite o evento `onClose`.
   */
  closeDialog() {
    this.isOpen = false;
    this.onClose.emit();
  }
}
