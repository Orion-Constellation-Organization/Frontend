import { Component, Input } from '@angular/core';
import { EnvironmentButton } from 'src/utils/enum/environmentButton.enum';

/**
 * Componente de botão reutilizável
 * @class ButtonComponent
 */
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  /** Texto a ser exibido no botão */
  @Input() label: string = '';
  /** Tipo do botão que define seu estilo visual */
  @Input() type: EnvironmentButton = EnvironmentButton.PRIMARY;
  /** Indica se o botão está desabilitado */
  @Input() disabled: boolean = false;

  /**
   * Obtém o tipo do botão
   * @returns {EnvironmentButton} Tipo do botão
   */
  get buttonType() {
    return this.type;
  }

  /**
   * Obtém as classes CSS baseadas no tipo do botão
   * @returns {Object} Objeto com as classes CSS
   */
  get buttonClass() {
    const {
      PRIMARY,
      SECONDARY,
      CANCEL,
      DELETE,
      SAVE,
      EDIT,
      CLOSE,
      SUBMIT,
      GHOST,
    } = EnvironmentButton;
    return {
      'button--primary': this.type === PRIMARY,
      'button--secondary': this.type === SECONDARY,
      'button--cancel': this.type === CANCEL,
      'button--delete': this.type === DELETE,
      'button--save': this.type === SAVE,
      'button--edit': this.type === EDIT,
      'button--close': this.type === CLOSE,
      'button--submit': this.type === SUBMIT,
      'button--ghost': this.type === GHOST,
      'button--disabled': this.disabled,
    };
  }
}
