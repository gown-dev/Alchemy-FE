import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthProxyService } from '../../services/auth-proxy.service';
import {Router} from '@angular/router';
import { of } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authProxyServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    authProxyServiceMock = {
      register: jasmine.createSpy('register').and.returnValue(of(200)),
      isAdminUser: jasmine.createSpy('isAdminUser').and.returnValue(of(false))
    };

    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule],
      providers: [
        {provide: AuthProxyService, useValue: authProxyServiceMock},
        {provide: Router, useValue: routerMock}
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
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

    expect(authProxyServiceMock.register).not.toHaveBeenCalled();
  });

  it('should call AuthProxyService.register when form is valid', () => {
    component.registerForm.get('username')!.setValue('testuser');
    component.registerForm.get('password')!.setValue('password123');

    component.onSubmit();

    expect(authProxyServiceMock.register).toHaveBeenCalledWith('testuser', 'password123');
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

  it('should redirect to /home on successful registration for normal user', () => {
    authProxyServiceMock.isAdminUser.and.returnValue(of(false));

    component.registerForm.get('username')!.setValue('testuser');
    component.registerForm.get('password')!.setValue('password123');

    component.onSubmit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should redirect to /admin on successful registration for admin user', () => {
    authProxyServiceMock.isAdminUser.and.returnValue(of(true));

    component.registerForm.get('username')!.setValue('adminuser');
    component.registerForm.get('password')!.setValue('password123');

    component.onSubmit();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/admin']);
  });

});
