import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthProxyService } from '../../services/auth-proxy.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  message: string = "";

  constructor(private authService: AuthProxyService) { }

  onSubmit() {
    if (this.loginForm.valid) {
      const payload = this.loginForm.value;

      this.authService.login(payload.username ?? "", payload.password ?? "").subscribe({
        next: (result) => {
          if (typeof result === 'number') {
            this.message = "Login success!"
          } else {
            this.message = "Login failed : " + result.message;
          }
        },
        error: (error) => {
          console.error('Login failed.', error);
        }
      });
    }
  }

}
