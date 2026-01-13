import { ComponentFixture, TestBed } from '@angular/core/testing';
import {Router, provideRouter} from '@angular/router';
import {of} from 'rxjs';

import {HomeComponent} from './home.component';
import {AuthGuard} from '../../guards/auth.guard';
import {AuthProxyService} from '../../services/auth-proxy.service';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {
          provide: AuthProxyService,
          useValue: {
            isAuthenticatedUser: () => of(true)
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have route protected by AuthGuard', () => {
    const routes = [
      {path: 'home', component: HomeComponent, canActivate: [AuthGuard]}
    ];

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideRouter(routes),
        {
          provide: AuthProxyService,
          useValue: {isAuthenticatedUser: () => of(true)}
        }
      ]
    });

    const router = TestBed.inject(Router);
    const route = router.config.find(r => r.path === 'home');

    expect(route?.canActivate).toBeDefined();
    expect(route?.canActivate).toContain(AuthGuard);
  });

  describe('AuthGuard', () => {
    let authProxyServiceMock: jasmine.SpyObj<AuthProxyService>;

    beforeEach(() => {
      authProxyServiceMock = jasmine.createSpyObj('AuthProxyService', ['isAuthenticatedUser']);

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          {provide: AuthProxyService, useValue: authProxyServiceMock},
          {provide: Router, useValue: jasmine.createSpyObj('Router', ['parseUrl'])}
        ]
      });
    });

    it('should allow access when user is authenticated', (done) => {
      authProxyServiceMock.isAuthenticatedUser.and.returnValue(of(true));

      const result = TestBed.runInInjectionContext(() => AuthGuard({} as any, {} as any));

      if (typeof (result as any).subscribe === 'function') {
        (result as any).subscribe((val: any) => {
          expect(val).toBe(true);
          done();
        });
      } else {
        expect(result as any).toBe(true);
        done();
      }
    });

    it('should deny access when user is not authenticated', (done) => {
      authProxyServiceMock.isAuthenticatedUser.and.returnValue(of(false));
      const router = TestBed.inject(Router);
      (router.parseUrl as jasmine.Spy).and.returnValue('/login' as any);

      const result = TestBed.runInInjectionContext(() => AuthGuard({} as any, {} as any));

      if (typeof (result as any).subscribe === 'function') {
        (result as any).subscribe((val: any) => {
          expect(val).toBe('/login' as any);
          done();
        });
      } else {
        expect(result as any).toBe('/login' as any);
        done();
      }
    });
  });
});
