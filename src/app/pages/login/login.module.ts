import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from './login.component';

import { StudentRegistrationFormComponent } from '../student-registration-form/student-registration-form.component';
import { TutorRegistrationFormComponent } from '../tutor-registration-form/tutor-registration-form.component';
import { RegistrationSuccessModalComponent } from './../../components/registration-success-modal/registration-success-modal.component';

@NgModule({
  declarations: [
    LoginComponent,
    StudentRegistrationFormComponent,
    TutorRegistrationFormComponent,
    RegistrationSuccessModalComponent,
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
  ],
  exports: [
    LoginComponent,
    StudentRegistrationFormComponent,
    TutorRegistrationFormComponent,
    RegistrationSuccessModalComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginModule {}
