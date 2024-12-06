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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationSuccessModalComponent } from './registration-success-modal/registration-success-modal.component';
import { StudentRegistrationFormComponent } from './student-registration-form/student-registration-form.component';
import { TutorRegistrationFormComponent } from './tutor-registration-form/tutor-registration-form.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { ButtonComponent } from './button/button.component';
import { ClassRequestFormComponent } from './class-request-form/class-request-form.component';
import { LessonCardManagerComponent } from './lesson-card-manager/lesson-card-manager.component';
import { ProfileComponent } from './profile/profile.component';
import { TutorRequestComponent } from './tutor-request/tutor-request.component';
import { LoadingService } from '../providers/loading.service';
import { LoadingComponent } from './loading/loading.component';
import { TutorBeginComponent } from './tutor-begin/tutor-begin.component';
import { TutorPersonalDataComponent } from './tutor-personal-data/tutor-personal-data.component';
import { TutorSecurityComponent } from './tutor-security/tutor-security.component';
import { TutorPersonalModalComponent } from './tutor-personal-modal/tutor-personal-modal.component';
import { DialogComponent } from './dialog/dialog.component';
import { DialogService } from '../providers/dialog.service';
import { TutorWaitingComponent } from './tutor-waiting/tutor-waiting.component';
import { DatePipe } from '../pipes/date.pipe';

const COMPONENTS = [
  RegistrationSuccessModalComponent,
  StudentRegistrationFormComponent,
  TutorRegistrationFormComponent,
  MainMenuComponent,
  ButtonComponent,
  ClassRequestFormComponent,
  LessonCardManagerComponent,
  ProfileComponent,
  TutorBeginComponent,
  TutorRequestComponent,
  TutorSecurityComponent,
  TutorPersonalDataComponent,
  LoadingComponent,
  DialogComponent,
  TutorWaitingComponent
] as const;

@NgModule({
  declarations: [...COMPONENTS, TutorBeginComponent, TutorPersonalDataComponent, TutorSecurityComponent, TutorPersonalModalComponent, TutorWaitingComponent, DatePipe],
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
    MatCheckboxModule,
    NgxMatDatetimePickerModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatGridListModule
  ],
  exports: [...COMPONENTS],
  providers: [provideNgxMask(), LoadingService, DialogService],
})
export class SharedComponentsModule {}
