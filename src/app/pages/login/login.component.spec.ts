import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthProxyService } from '../../services/auth-proxy.service';
import {Router} from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authProxyServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authProxyServiceMock = {
      login: jasmine.createSpy('login').and.returnValue(of(200))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        {provide: AuthProxyService, useValue: authProxyServiceMock},
        {provide: Router, useValue: routerMock}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should validate username field', () => {
    const username = component.loginForm.get('username')!;
    expect(username.valid).toBeFalsy();

    username.setValue('testuser');
    expect(username.valid).toBeTruthy();
  });

  it('should validate password field', () => {
    const password = component.loginForm.get('password')!;
    expect(password.valid).toBeFalsy();

    password.setValue('password123');
    expect(password.valid).toBeTruthy();
  });

  it('should make the form valid when all fields are filled', () => {
    component.loginForm.get('username')!.setValue('testuser');
    component.loginForm.get('password')!.setValue('password123');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call authProxyService.login on submit when form is valid', () => {
    component.loginForm.get('username')!.setValue('testuser');
    component.loginForm.get('password')!.setValue('password123');

    component.onSubmit();

    expect(authProxyServiceMock.login).toHaveBeenCalledWith('testuser', 'password123');
  });

  it('should not call authProxyService.login on submit when form is invalid', () => {
    component.loginForm.get('username')!.setValue('');
    component.loginForm.get('password')!.setValue('');

    component.onSubmit();

    expect(authProxyServiceMock.login).not.toHaveBeenCalled();
  });

  it('should disable the submit button when the form is invalid', () => {
    component.loginForm.get('username')!.setValue('');
    component.loginForm.get('password')!.setValue('');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const submitBtn = compiled.querySelector('.login-btn') as HTMLButtonElement;
    expect(submitBtn.disabled).toBeTruthy();
  });

  it('should enable the submit button when the form is valid', () => {
    component.loginForm.get('username')!.setValue('testuser');
    component.loginForm.get('password')!.setValue('password123');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const submitBtn = compiled.querySelector('.login-btn') as HTMLButtonElement;
    expect(submitBtn.disabled).toBeFalsy();
  });

  it('should redirect to /home on successful login', () => {
    component.loginForm.get('username')!.setValue('testuser');
    component.loginForm.get('password')!.setValue('password123');

    component.onSubmit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });
});
