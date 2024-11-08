import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-class-request-form',
  templateUrl: './class-request-form.component.html',
  styleUrls: ['./class-request-form.component.scss'],
})
export class ClassRequestFormComponent {
  @Output() closeModal = new EventEmitter<void>();

  classRequestForm: FormGroup;

  reasonOptions = [
    'Reforço do conteúdo',
    'Prova ou trabalho específico',
    'Correção de exercício',
    'Outro',
  ];

  subjects = [
    'Biologia',
    'Sociologia',
    'Gramática',
    'Geografia',
    'História',
    'Filosofía',
    'Literatura',
    'Inglês',
    'Química',
    'Física',
    'Redação',
    'Matemática',
  ];

  constructor(private fb: FormBuilder) {
    this.classRequestForm = this.fb.group({
      reasons: this.fb.array([], [Validators.required]),
      schedules: this.fb.array(
        [this.createScheduleControl()],
        [Validators.required]
      ),
      subject: ['', Validators.required],
      additionalInfo: ['', Validators.required],
    });
  }

  private createScheduleControl() {
    return this.fb.control('', Validators.required);
  }

  get schedules() {
    return this.classRequestForm.get('schedules') as FormArray;
  }

  addSchedule() {
    this.schedules.push(this.createScheduleControl());
  }

  removeSchedule(index: number) {
    this.schedules.removeAt(index);
  }

  onReasonChange(reason: string, event: any) {
    const reasonsArray = this.classRequestForm.get('reasons') as FormArray;
    if (event.checked) {
      reasonsArray.push(this.fb.control(reason));
    } else {
      const index = reasonsArray.controls.findIndex(
        (control) => control.value === reason
      );
      if (index >= 0) {
        reasonsArray.removeAt(index);
      }
    }
  }

  onSubmit() {
    if (this.classRequestForm.valid) {
      console.log(this.classRequestForm.value);
      // Implementar lógica de envio
      this.closeModal.emit();
    }
  }
}
