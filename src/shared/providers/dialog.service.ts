import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogComponent } from '../components/dialog/dialog.component';
import { IDialogData } from '../interfaces/IDialogData';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  public constructor(private dialog: MatDialog) {}

  openInfoDialog(config: IDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: config,
    });
    return dialogRef.afterClosed();
  }
}