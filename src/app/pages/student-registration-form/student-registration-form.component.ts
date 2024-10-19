import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { RegistrationSuccessModalComponent } from 'src/app/components/registration-success-modal/registration-success-modal.component';
import { StudentService } from '../../providers/student.service';

@Component({
  selector: 'app-student-registration-form',
  templateUrl: './student-registration-form.component.html',
  styleUrls: ['./student-registration-form.component.scss'],
  providers: [DatePipe]
})
export class StudentRegistrationFormComponent {
  registrationForm: FormGroup;
  emailAlreadyRegistered = false;
  hidePassword = true;
  hideConfirmPassword = true;
  educationLevels = ['Fundamental', 'Ensino Médio', 'Pré Vestibular'];
  errorMessage ='';

  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild(RegistrationSuccessModalComponent) registrationSuccessModal!: RegistrationSuccessModalComponent;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private router: Router,
    private studentService: StudentService
  ) {
    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      username: ['', Validators.required],
      birthDate: ['', [Validators.required, this.birthDateValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      ]],
      confirmPassword: ['', Validators.required],
      educationLevel: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
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
    this.emailAlreadyRegistered = false;
    this.errorMessage = '';

    if (this.registrationForm.valid) {
      const registrationData = this.registrationForm.value;

      await this.studentService.createStudent(registrationData).then(resp => {
        localStorage.setItem('studentRegistration', JSON.stringify(registrationData));
  
        console.log('Cadastro realizado com sucesso:', registrationData);
      })
      
      this.openRegistrationSuccessDialog();
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
