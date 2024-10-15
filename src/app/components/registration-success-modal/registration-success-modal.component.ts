import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-registration-success-modal',
  templateUrl: './registration-success-modal.component.html',
  styleUrls: ['./registration-success-modal.component.scss']
})
export class RegistrationSuccessModalComponent {
  @Input() isOpen: boolean = false; 
  @Output() onClose = new EventEmitter<void>(); 

  closeDialog() {
    this.isOpen = false; 
    this.onClose.emit(); 
  }
}
