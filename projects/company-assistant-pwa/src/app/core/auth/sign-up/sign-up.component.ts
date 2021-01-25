import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  @Input() error: string | null;
  @Output() submitEM = new EventEmitter();

  signUpForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  hide = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  signUp(email: string, password: string): void {
    this.authService.signUp(email, password);
  }

  submit() {
    if (this.signUpForm.valid) {
      this.submitEM.emit(this.signUpForm.value);
      this.authService
        .login(
          this.signUpForm.get('email').value,
          this.signUpForm.get('password').value
        )
        .then((data) => {
          this.router.navigate(['working-hours']);
        });
    }
  }

  get emailInput() {
    return this.signUpForm.get('email');
  }

  get passwordInput() {
    return this.signUpForm.get('password');
  }
}
