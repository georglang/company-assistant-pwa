import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-print-dialog',
  templateUrl: './print-dialog.component.html',
  styleUrls: ['./print-dialog.component.scss']
})
export class PrintDialogComponent implements OnInit {
  workingHoursChecked = true;
  notesChecked = true;
  materialsChecked = true;

  constructor(private dialogRef: MatDialogRef<PrintDialogComponent>) {}

  ngOnInit() {}

  cancle(): void {
    this.dialogRef.close({ shouldSave: false });
  }

  closeAndSave(): void {
    // if (this.emailFormGroup.invalid) {
    //   return;
    // } else {
    //   this.dialogRef.close({
    //     shouldSave: true,
    //     emails: this.emailInputControls()
    //   });
    // }
  }
}
