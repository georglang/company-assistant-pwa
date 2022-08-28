import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-setttings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss']
})
export class SettingsDialogComponent implements OnInit {
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

  constructor() {}

  ngOnInit() {
    this.passwordForm.controls['password'].valueChanges.subscribe((input) => {
      if (input === 'loeschen') {
        this.isPasswordCorrect = true;
      }
    });
  }
}
