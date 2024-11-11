import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { EnvironmentButton } from 'src/utils/enum/environmentButton.enum';
import { Reason, ReasonLabel } from 'src/utils/enum/reason.enum';
import { Subject } from 'src/utils/enum/subject.enum';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-class-request-form',
  templateUrl: './class-request-form.component.html',
  styleUrls: ['./class-request-form.component.scss'],
})
export class ClassRequestFormComponent {
  @Output() closeModal = new EventEmitter<void>();

  classRequestForm: FormGroup;
  reasonOptions = Object.values(Reason).map((reason) => ({
    value: reason,
    label: ReasonLabel[reason],
  }));

  subjects = Object.values(Subject);

  EnvironmentButton = EnvironmentButton;

  constructor(private fb: FormBuilder) {
    this.classRequestForm = this.fb.group({
      reasons: this.fb.array([], [Validators.required]),
      schedules: this.fb.array(
        [this.createScheduleControl()],
        [Validators.required]
      ),
      subject: ['', Validators.required],
      additionalInfo: [''],
    });
  }

  private createScheduleControl() {
    return this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
    });
  }

  get schedules() {
    return this.classRequestForm.get('schedules') as FormArray;
  }

  addSchedule() {
    if (this.schedules.length < 3) {
      this.schedules.push(this.createScheduleControl());
    }
  }

  get canAddMoreSchedules(): boolean {
    return this.schedules.length < 3;
  }

  removeSchedule(index: number) {
    this.schedules.removeAt(index);
  }

  onReasonChange(reason: Reason, event: MatCheckboxChange) {
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
