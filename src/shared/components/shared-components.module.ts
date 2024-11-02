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
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationSuccessModalComponent } from './registration-success-modal/registration-success-modal.component';
import { StudentRegistrationFormComponent } from './student-registration-form/student-registration-form.component';
import { TutorRegistrationFormComponent } from './tutor-registration-form/tutor-registration-form.component';
import { MainMenuComponent } from './main-menu/main-menu.component';

const COMPONENTS = [
  RegistrationSuccessModalComponent,
  StudentRegistrationFormComponent,
  TutorRegistrationFormComponent,
  MainMenuComponent,
] as const;

@NgModule({
  declarations: [...COMPONENTS],
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
    NgxMaskDirective,
  ],
  exports: [...COMPONENTS],
  providers: [provideNgxMask()],
})
export class SharedComponentsModule {}
