import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import {AuthProxyService} from '../../services/auth-proxy.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required])
  });

  protected errorMessage:string = '';

  constructor(private authProxyService:AuthProxyService, private router:Router) {
  }

  onSubmit() {
    this.errorMessage = '';
    if(this.loginForm.valid) {
    this.authProxyService.login(this.loginForm.value.username || "", this.loginForm.value.password || "")
      .subscribe({
        next: response => {
          this.authProxyService.isAdminUser().subscribe(isAdmin => {
            console.log('isAdmin', isAdmin);
            if (isAdmin) {
              this.router.navigate(['/admin']);
            } else {
              this.router.navigate(['/home']);
            }
          })
        },
        error: error => {
          if(error.error?.message) {
            this.errorMessage = error.error.message;
          }
        }
      });
    }
  }
}
