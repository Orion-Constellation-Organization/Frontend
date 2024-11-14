import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Componente responsável por exibir um modal de sucesso após o registro.
 *
 * @component
 * @export
 * @class RegistrationSuccessModalComponent
 */
@Component({
  selector: 'app-registration-success-modal',
  templateUrl: './registration-success-modal.component.html',
  styleUrls: ['./registration-success-modal.component.scss'],
})
export class RegistrationSuccessModalComponent {
  /**
   * Mensagem a ser exibida no modal.
   * Se não for fornecida, será usado o texto padrão "Cadastro efetuado com sucesso!"
   *
   * @type {string}
   * @memberof RegistrationSuccessModalComponent
   * @default 'Cadastro efetuado com sucesso!'
   */
  @Input() message: string = 'Cadastro efetuado com sucesso!';

  /**
   * Controla a visibilidade do modal.
   *
   * @type {boolean}
   * @memberof RegistrationSuccessModalComponent
   * @default false
   */
  @Input() isOpen = false;

  /**
   * Evento emitido quando o usuário fecha o modal.
   * O componente pai deve escutar este evento para atualizar o estado do modal.
   *
   * @type {EventEmitter<void>}
   * @memberof RegistrationSuccessModalComponent
   */
  @Output() onClose = new EventEmitter<void>();

  /**
   * Fecha o modal e notifica o componente pai através do evento onClose.
   *
   * @memberof RegistrationSuccessModalComponent
   * @returns {void}
   */
  closeDialog(): void {
    this.isOpen = false;
    this.onClose.emit();
  }
}
