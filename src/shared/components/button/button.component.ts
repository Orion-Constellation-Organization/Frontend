import { Component, Input } from '@angular/core';
import { EnvironmentButton } from 'src/utils/enum/environmentButton';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() label: string = '';
  @Input() type: EnvironmentButton =
    EnvironmentButton.PRIMARY ||
    EnvironmentButton.SECONDARY ||
    EnvironmentButton.CANCEL ||
    EnvironmentButton.DELETE ||
    EnvironmentButton.SAVE ||
    EnvironmentButton.CLOSE ||
    EnvironmentButton.SUBMIT ||
    EnvironmentButton.GHOST;

  get buttonType() {
    return this.type;
  }

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
