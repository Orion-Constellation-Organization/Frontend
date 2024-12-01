import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EnvironmentButton } from '../../../utils/enum/environmentButton.enum';

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
   * Controla a visibilidade dos botões de exclusão.
   *
   * @type {boolean}
   * @memberof RegistrationSuccessModalComponent
   * @default false
   */
  @Input() showDeleteButtons = false;

  /**
   * Evento emitido quando o usuário fecha o modal.
   * O componente pai deve escutar este evento para atualizar o estado do modal.
   *
   * @type {EventEmitter<void>}
   * @memberof RegistrationSuccessModalComponent
   */
  @Output() onClose = new EventEmitter<void>();

  /**
   * Evento emitido quando o usuário confirma a exclusão.
   * O componente pai deve escutar este evento para atualizar o estado do modal.
   *
   * @type {EventEmitter<void>}
   * @memberof RegistrationSuccessModalComponent
   */
  @Output() onConfirmDelete = new EventEmitter<void>();

  /**
   * Armazena os botões de ambiente disponíveis para cancelar e excluir.
   * @type {EnvironmentButton}
   */
  public EnvironmentButton = EnvironmentButton;

  /**
   * Controla a visibilidade do botão de fechar.
   *
   * @type {boolean}
   * @memberof RegistrationSuccessModalComponent
   * @default false
   */
  @Input() showCloseButton = true;

  /**
   * Fecha o modal e notifica o componente pai através do evento onClose.
   *
   * @memberof RegistrationSuccessModalComponent
   * @returns {void}
   */
  public closeDialog(): void {
    this.isOpen = false;
    this.onClose.emit();
  }

  /**
   * Confirma a exclusão e fecha o modal.
   *
   * @memberof RegistrationSuccessModalComponent
   * @returns {void}
   */
  public confirmDelete(): void {
    this.onConfirmDelete.emit();
    this.closeDialog();
  }
}
