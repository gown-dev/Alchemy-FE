import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import {AuthProxyService} from '../../services/auth-proxy.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm = new FormGroup({
    username: new FormControl('', Validators.required),
    // email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });

  constructor(private authProxyService:AuthProxyService, private router:Router) {
  }

  onSubmit() {
    if(this.registerForm.invalid) return;
    this.authProxyService.register(this.registerForm.value.username!, this.registerForm.value.password!)
      .subscribe(response => {
        this.router.navigate(['/login']);
      });
  }
}
