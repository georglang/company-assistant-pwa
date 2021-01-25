import { Component, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotpasswordComponent {
  @Input() error: string | null;

  forgotpasswordForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required])
  });
  constructor(private authService: AuthService) {}

  submit(passwordResetEmail: string): void {
    this.authService.forgotPassword(passwordResetEmail);
  }

  get emailInput() {
    return this.forgotpasswordForm.get('email');
  }
}
