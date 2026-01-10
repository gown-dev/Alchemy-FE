import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthProxyService } from '../../services/auth-proxy.service';
import {Router} from '@angular/router';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authProxyServiceSpy: jasmine.SpyObj<AuthProxyService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthProxyService', ['register']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        {provide: AuthProxyService, useValue: spy},
        {provide: Router, useValue: routerSpyObj}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authProxyServiceSpy = TestBed.inject(AuthProxyService) as jasmine.SpyObj<AuthProxyService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.registerForm.get('username')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
  });

  it('should make the username control required', () => {
    const control = component.registerForm.get('username');
    control?.setValue('');
    expect(control?.valid).toBeFalsy();
  });

  it('should make the password control required and have min length of 8', () => {
    const control = component.registerForm.get('password');

    control?.setValue('');
    expect(control?.valid).toBeFalsy();

    control?.setValue('1234567');
    expect(control?.valid).toBeFalsy();

    control?.setValue('12345678');
    expect(control?.valid).toBeTruthy();
  });

  it('should not call AuthProxyService.register when form is invalid', () => {
    component.registerForm.get('username')?.setValue('');
    component.registerForm.get('password')?.setValue('');

    component.onSubmit();

    expect(authProxyServiceSpy.register).not.toHaveBeenCalled();
  });

  it('should call AuthProxyService.register when form is valid', () => {
    const username = 'testuser';
    const password = 'password123';
    authProxyServiceSpy.register.and.returnValue(of({} as any));

    component.registerForm.get('username')?.setValue(username);
    component.registerForm.get('password')?.setValue(password);

    component.onSubmit();

    expect(authProxyServiceSpy.register).toHaveBeenCalledWith(username, password);
  });

  it('should disable the submit button when the form is invalid', () => {
    component.registerForm.get('username')?.setValue('');
    component.registerForm.get('password')?.setValue('');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const submitBtn = compiled.querySelector('.register-btn') as HTMLButtonElement;
    expect(submitBtn.disabled).toBeTruthy();
  });

  it('should enable the submit button when the form is valid', () => {
    component.registerForm.get('username')?.setValue('testuser');
    component.registerForm.get('password')?.setValue('password123');
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const submitBtn = compiled.querySelector('.register-btn') as HTMLButtonElement;
    expect(submitBtn.disabled).toBeFalsy();
  });

  it('should redirect to /login on successful registration', () => {
    const username = 'testuser';
    const password = 'password123';
    authProxyServiceSpy.register.and.returnValue(of({} as any));

    component.registerForm.get('username')?.setValue(username);
    component.registerForm.get('password')?.setValue(password);

    component.onSubmit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
