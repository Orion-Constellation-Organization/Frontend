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
    return {
      'button-primary': this.type === EnvironmentButton.PRIMARY,
      'button-secondary': this.type === EnvironmentButton.SECONDARY,
      'button-cancel': this.type === EnvironmentButton.CANCEL,
      'button-delete': this.type === EnvironmentButton.DELETE,
      'button-save': this.type === EnvironmentButton.SAVE,
      'button-close': this.type === EnvironmentButton.CLOSE,
      'button-submit': this.type === EnvironmentButton.SUBMIT,
      'button-ghost': this.type === EnvironmentButton.GHOST,
    };
  }
}
