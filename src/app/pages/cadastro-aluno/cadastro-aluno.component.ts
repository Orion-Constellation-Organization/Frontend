import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { CadastroConcluidoDialogComponent } from '../../components/cadastro-concluido-dialog/cadastro-concluido-dialog.component';

@Component({
  selector: 'app-cadastro-aluno',
  templateUrl: './cadastro-aluno.component.html',
  styleUrls: ['./cadastro-aluno.component.scss'],
  providers: [DatePipe]
})
export class CadastroAlunoComponent {
  cadastroForm: FormGroup;
  emailJaCadastrado = false;
  hidePassword = true;
  hideConfirmPassword = true;
  educationLevels = ['Fundamental', 'Ensino Médio', 'Pré Vestibular'];
  msgerror: string = '';

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.cadastroForm = this.fb.group({
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

  
    if (selectedDate > today) {
      return { futureDate: true }; 
    }
    return null; 
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    this.emailJaCadastrado = false;
    this.msgerror = '';

    if (this.cadastroForm.valid) {
      const birthDate = this.cadastroForm.get('birthDate')?.value;
      const formattedBirthDate = this.datePipe.transform(birthDate, 'dd/MM/yyyy');

      const cadastroData = {
        fullName: this.cadastroForm.get('fullName')?.value,
        username: this.cadastroForm.get('username')?.value,
        birthDate: formattedBirthDate,
        password: this.cadastroForm.get('password')?.value,
        email: this.cadastroForm.get('email')?.value,
        educationLevel: [this.cadastroForm.get('educationLevel')?.value]
      };

      localStorage.setItem('cadastroAluno', JSON.stringify(cadastroData));

      console.log('Dados armazenados com sucesso', cadastroData);
      this.openCadastroConcluidoDialog();
    }
  }

  openCadastroConcluidoDialog() {
    const dialogRef = this.dialog.open(CadastroConcluidoDialogComponent, {
      width: '400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      this.cadastroForm.reset();
    });
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
