import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

import { RegistrationSuccessModalComponent } from 'src/shared/components/registration-success-modal/registration-success-modal.component';
import { TutorService } from '../../../shared/providers/tutor.service';

@Component({
  selector: 'app-tutor-registration-form',
  templateUrl: './tutor-registration-form.component.html',
  styleUrls: ['./tutor-registration-form.component.scss'],
  providers: [DatePipe],
})
export class TutorRegistrationFormComponent {
  registrationForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  tutorSubjects = ['Matemática', 'Física', 'Química', 'Biologia', 'História'];
  errorMessage = '';

  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild(RegistrationSuccessModalComponent)
  registrationSuccessModal!: RegistrationSuccessModalComponent;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private router: Router,
    private tutorService: TutorService
  ) {
    this.registrationForm = this.fb.group(
      {
        fullName: ['', Validators.required],
        username: ['', Validators.required],
        birthDate: ['', [Validators.required, this.birthDateValidator]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
            ), // Mínimo 1 letra maiúscula, 1 número e 1 caractere especial
          ],
        ],
        confirmPassword: ['', Validators.required],
        tutorSubjects: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  birthDateValidator(control: AbstractControl) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    return selectedDate > today ? { futureDate: true } : null;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  async onSubmit() {
    if (this.registrationForm.valid) {
      const registrationData = this.registrationForm.value;
      await this.tutorService.createTutor(registrationData).then((resp) => {
        localStorage.setItem(
          'TutorRegistration',
          JSON.stringify(registrationData)
        );

        this.openRegistrationSuccessDialog();
      });
    } else {
      this.errorMessage =
        'Por favor, preencha todos os campos obrigatórios corretamente.';
    }
  }

  openRegistrationSuccessDialog() {
    this.registrationSuccessModal.isOpen = true;
  }

  closeRegistrationSuccessDialog() {
    this.registrationSuccessModal.isOpen = false;
    this.registrationForm.reset();
    this.closeModal.emit();
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }
}
