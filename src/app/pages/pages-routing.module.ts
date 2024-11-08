import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { TutorRegistrationFormComponent } from 'src/shared/components/tutor-registration-form/tutor-registration-form.component';
import { StudentRegistrationFormComponent } from 'src/shared/components/student-registration-form/student-registration-form.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'main', component: MainComponent },
  {
    path: 'tutor-registration-form',
    component: TutorRegistrationFormComponent,
  },
  {
    path: 'student-registration-form',
    component: StudentRegistrationFormComponent,
  },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
