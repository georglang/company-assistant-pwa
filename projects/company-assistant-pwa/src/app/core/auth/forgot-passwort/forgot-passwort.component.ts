import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-passwort',
  templateUrl: './forgot-passwort.component.html',
  styleUrls: ['./forgot-passwort.component.scss']
})
export class ForgotPasswortComponent implements OnInit {
  @Input() error: string | null;

  forgotPasswortForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required])
  });
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  submit(passwordResetEmail: string): void {
    this.authService.forgotPassword(passwordResetEmail);
  }

  get emailInput() {
    return this.forgotPasswortForm.get('email');
  }
}
