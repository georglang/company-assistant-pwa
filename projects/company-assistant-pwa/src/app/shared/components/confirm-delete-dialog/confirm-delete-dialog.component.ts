import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-dialog',
  templateUrl: './confirm-delete-dialog.component.html',
  styleUrls: ['./confirm-delete-dialog.component.scss']
})
export class ConfirmDeleteDialogComponent implements OnInit {
  public modalTitle: string;
  public passwordCorrect: string;
  public hide = true;
  public isPasswordCorrect = false;

  public passwordForm: UntypedFormGroup = new UntypedFormGroup({
    password: new UntypedFormControl('', [Validators.required, Validators.min(3)])
  });

  get passwordInput() {
    return this.passwordForm.get('password');
  }

  constructor(public dialog: MatDialog) {}

  ngOnInit() {
    this.passwordForm.controls['password'].valueChanges.subscribe((input) => {
      if (input === 'loeschen') {
        this.isPasswordCorrect = true;
      }
    });
  }
}
