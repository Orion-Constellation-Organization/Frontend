import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TutorRegistrationFormComponent } from './tutor-registration-form.component';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

describe('TutorRegistrationFormComponent', () => {
  let component: TutorRegistrationFormComponent;
  let fixture: ComponentFixture<TutorRegistrationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TutorRegistrationFormComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        MatDatepickerModule,
        MatNativeDateModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorRegistrationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(component.registrationForm.valid).toBeFalsy();
  });

  it('form should be valid when all fields are filled correctly', () => {
    component.registrationForm.controls['fullName'].setValue('John Doe');
    component.registrationForm.controls['username'].setValue('johndoe');
    component.registrationForm.controls['birthDate'].setValue('1990-01-01');
    component.registrationForm.controls['email'].setValue('john.doe@example.com');
    component.registrationForm.controls['password'].setValue('Password1!');
    component.registrationForm.controls['confirmPassword'].setValue('Password1!');
    component.registrationForm.controls['tutorSubjects'].setValue(['Matemática']);

    expect(component.registrationForm.valid).toBeTruthy();
  });

  it('should show error when passwords do not match', () => {
    component.registrationForm.controls['password'].setValue('Password1!');
    component.registrationForm.controls['confirmPassword'].setValue('Password2!');
    fixture.detectChanges();

    const passwordError = component.registrationForm.errors?.['passwordMismatch'];
    expect(passwordError).toBeTruthy();
  });

  it('should show error if no subject is selected', () => {
    component.registrationForm.controls['tutorSubjects'].setValue([]);
    fixture.detectChanges();

    const subjectError = component.registrationForm.controls['tutorSubjects'].hasError('required');
    expect(subjectError).toBeTruthy();
  });

  it('should toggle password visibility', () => {
    expect(component.hidePassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.hidePassword).toBeFalse();
  });

  it('should toggle confirm password visibility', () => {
    expect(component.hideConfirmPassword).toBeTrue();
    component.toggleConfirmPasswordVisibility();
    expect(component.hideConfirmPassword).toBeFalse();
  });
});
