import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-tutor-begin',
  templateUrl: './tutor-begin.component.html',
  styleUrls: ['./tutor-begin.component.scss']
})

export class TutorBeginComponent {
  @Input() hasSubjects: boolean = false;
  @Output() profileClick = new EventEmitter<void>();

  /**
   * Emite uma ação ao clicar na palavra "perfil"
   */
  public onProfileClick(): void {
    this.profileClick.emit();
  }
}