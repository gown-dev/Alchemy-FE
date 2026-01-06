import { Component, OnInit } from '@angular/core';
import { AuthProxyService } from '../../services/auth-proxy.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  isAuthenticated: boolean = false;
  isAdmin: boolean = false;

  constructor(private authService: AuthProxyService) { }

  ngOnInit(): void {
    this.authService.isAuthenticatedUser().subscribe(result => {
      this.isAuthenticated = false;

      if (this.isAuthenticated) {
        this.authService.isAdminUser().subscribe(result => this.isAdmin = result);
      }
    });
  }

}
