import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { IRoles, Roles } from '../roles';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  @Input() error: string | null;
  @Output() submitEM = new EventEmitter();

  signUpForm: UntypedFormGroup = new UntypedFormGroup({
    displayName: new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', [Validators.required]),
    password: new UntypedFormControl('', [Validators.required]),
    isAdmin: new UntypedFormControl(false, [Validators.required]),
    isUserAdmin: new UntypedFormControl(false, [Validators.required]),
    isEmployee: new UntypedFormControl(false, [Validators.required])
  });

  hide = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  signUp(): void {
    if (this.signUpForm.valid) {
      this.authService.signUp(
        this.signUpForm.get('email').value,
        this.signUpForm.get('password').value,
        new Roles(
          this.signUpForm.get('isAdmin').value,
          this.signUpForm.get('isUserAdmin').value,
          this.signUpForm.get('isEmployee').value
        ),
        this.signUpForm.get('displayName').value
      );
    }
  }

  submit() {
    if (this.signUpForm.valid) {
      this.submitEM.emit(this.signUpForm.value);
      const userRoles: IRoles = {
        admin: this.signUpForm.get('isAdmin').value,
        employee: this.signUpForm.get('isUserAdmin').value,
        userAdmin: this.signUpForm.get('isEmployee').value
      };
      this.authService
        .login(
          this.signUpForm.get('email').value,
          this.signUpForm.get('password').value
        )
        .then((data) => {
          this.router.navigate(['orders']);
        });
    }
  }

  get emailInput() {
    return this.signUpForm.get('email');
  }

  get passwordInput() {
    return this.signUpForm.get('password');
  }

  get displayNameInput() {
    return this.signUpForm.get('displayName');
  }
}
