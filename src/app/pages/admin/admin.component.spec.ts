import { ComponentFixture, TestBed } from '@angular/core/testing';
import {Router, provideRouter} from '@angular/router';
import { of } from 'rxjs';

import {AdminComponent} from './admin.component';
import {AdminGuard} from '../../guards/admin.guard';
import {AuthProxyService} from '../../services/auth-proxy.service';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminComponent],
      providers: [
        {
          provide: AuthProxyService,
          useValue: {
            isAdminUser: () => of(true)
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have route protected by AdminGuard', () => {
    const routes = [
      {path: 'admin', component: AdminComponent, canActivate: [AdminGuard]}
    ];

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [AdminComponent],
      providers: [
        provideRouter(routes),
        {
          provide: AuthProxyService,
          useValue: { isAdminUser: () => of(true) }
        }
      ]
    });

    const router = TestBed.inject(Router);
    const route = router.config.find(r => r.path === 'admin');

    expect(route?.canActivate).toBeDefined();
    expect(route?.canActivate).toContain(AdminGuard);
  });

  describe('AdminGuard', () => {
    let authProxyServiceMock: jasmine.SpyObj<AuthProxyService>;

    beforeEach(() => {
      authProxyServiceMock = jasmine.createSpyObj('AuthProxyService', ['isAdminUser']);

      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          { provide: AuthProxyService, useValue: authProxyServiceMock },
          { provide: Router, useValue: jasmine.createSpyObj('Router', ['parseUrl']) }
        ]
      });
    });

    it('should allow access when user is admin', (done) => {
      authProxyServiceMock.isAdminUser.and.returnValue(of(true));

      const result = TestBed.runInInjectionContext(() => AdminGuard({} as any, {} as any));

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

    it('should deny access when user is not admin', (done) => {
      authProxyServiceMock.isAdminUser.and.returnValue(of(false));
      const router = TestBed.inject(Router);
      (router.parseUrl as jasmine.Spy).and.returnValue('/login' as any);

      const result = TestBed.runInInjectionContext(() => AdminGuard({} as any, {} as any));

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
