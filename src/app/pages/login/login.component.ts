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

  constructor(private authProxyService:AuthProxyService, private router:Router) {
  }

  onSubmit() {
    if(this.loginForm.invalid) return;
    this.authProxyService.login(this.loginForm.value.username!, this.loginForm.value.password!)
      .subscribe(response => {
        this.router.navigate(['/home']);
      });
  }
}
