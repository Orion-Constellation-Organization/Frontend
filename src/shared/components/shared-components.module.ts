import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicModalComponent } from './dynamic-modal/dynamic-modal.component';
import { RegistrationSuccessModalComponent } from './registration-success-modal/registration-success-modal.component';
import { StudentRegistrationFormComponent } from './student-registration-form/student-registration-form.component';
import { TutorRegistrationFormComponent } from './tutor-registration-form/tutor-registration-form.component';
import { MainMenuComponent } from './main-menu/main-menu.component';

@NgModule({
  declarations: [
    DynamicModalComponent,
    RegistrationSuccessModalComponent,
    StudentRegistrationFormComponent,
    TutorRegistrationFormComponent,
    MainMenuComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSidenavModule,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    DynamicModalComponent,
    RegistrationSuccessModalComponent,
    StudentRegistrationFormComponent,
    TutorRegistrationFormComponent,
    MainMenuComponent,
  ],
})
export class SharedComponentsModule {}
