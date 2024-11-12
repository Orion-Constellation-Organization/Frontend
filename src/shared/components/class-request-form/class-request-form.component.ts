import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { EnvironmentButton } from 'src/utils/enum/environmentButton.enum';
import { Reason, ReasonLabel } from 'src/utils/enum/reason.enum';
import { Subject } from 'src/utils/enum/subject.enum';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ClassRequestService } from '../../providers/class-request.service';
import { AuthService } from '../../providers/auth.service';
import { IClassRequest } from '../../interfaces/class-request.interface';
import { formatDate } from '@angular/common';
import { SubjectService } from '../../providers/subject.service';
import { ISubject } from '../../interfaces/subject.interface';

@Component({
  selector: 'app-class-request-form',
  templateUrl: './class-request-form.component.html',
  styleUrls: ['./class-request-form.component.scss'],
})
export class ClassRequestFormComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  classRequestForm: FormGroup;
  reasonOptions = Object.values(Reason).map((reason) => ({
    value: reason,
    label: ReasonLabel[reason],
  }));

  subjects: ISubject[] = [];

  EnvironmentButton = EnvironmentButton;

  constructor(
    private fb: FormBuilder,
    private classRequestService: ClassRequestService,
    private authService: AuthService,
    private subjectService: SubjectService
  ) {
    this.classRequestForm = this.fb.group({
      reasons: this.fb.array([], [Validators.required]),
      schedules: this.fb.array(
        [this.createScheduleControl()],
        [Validators.required]
      ),
      subjectId: ['', Validators.required],
      additionalInfo: [''],
    });
  }

  async ngOnInit() {
    try {
      this.subjects = await this.subjectService.getSubjects();
    } catch (error) {
      console.error('Erro ao carregar matérias:', error);
    }
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

  private formatSchedule(date: Date, time: string): string {
    const formattedDate = formatDate(date, 'dd/MM/yyyy', 'en-US');
    return `${formattedDate} às ${time}`;
  }

  private prepareRequestData(): IClassRequest {
    const formValue = this.classRequestForm.value;
    const decodedToken = this.authService.getDecodedToken();

    if (!decodedToken?.id) {
      throw new Error('Usuário não autenticado');
    }

    const preferredDates = formValue.schedules.map((schedule: any) =>
      this.formatSchedule(schedule.date, schedule.time)
    );

    return {
      reason: formValue.reasons,
      preferredDates,
      subjectId: formValue.subjectId,
      additionalInfo: formValue.additionalInfo || '',
      studentId: decodedToken.id,
    };
  }

  async onSubmit() {
    if (this.classRequestForm.valid) {
      try {
        const requestData = this.prepareRequestData();
        await this.classRequestService.createClassRequest(requestData);
        this.closeModal.emit();
      } catch (error) {
        console.error('Erro ao enviar solicitação:', error);
        // Aqui você pode adicionar uma lógica para mostrar mensagem de erro
      }
    }
  }
}
