import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ApiConfiguration } from './api/api-configuration';
import { API_BACKEND_URL } from './app.backend';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  private apiConfiguration = inject(ApiConfiguration);

  ngOnInit(): void {
    this.apiConfiguration.rootUrl = API_BACKEND_URL;
  }

}
