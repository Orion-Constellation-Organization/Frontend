import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cadastro-concluido-dialog',
  templateUrl: './cadastro-concluido-dialog.component.html',
  styleUrls: ['./cadastro-concluido-dialog.component.scss']
})
export class CadastroConcluidoDialogComponent {
  constructor(public dialogRef: MatDialogRef<CadastroConcluidoDialogComponent>) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
