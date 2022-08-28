import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NewAuthService } from '../../../shared/services/newAuth.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  @Input() error: string | null;
  @Output() submitEM = new EventEmitter();

  signInForm: UntypedFormGroup = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required]),
    password: new UntypedFormControl('', [Validators.required])
  });

  hide = true;

  constructor(private authService: NewAuthService, private router: Router) {}

  ngOnInit() {}

  get emailInput() {
    return this.signInForm.get('email');
  }

  get passwordInput() {
    return this.signInForm.get('password');
  }

  submit() {
    if (this.signInForm.valid) {
      this.submitEM.emit(this.signInForm.value);
      this.authService.login(
        this.signInForm.get('email').value,
        this.signInForm.get('password').value
      )
    }
  }
}
