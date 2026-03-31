import { Component, OnInit, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet } from '@angular/router';
import { routes } from './app/app.routes';
import { ThemeService } from './app/services/theme.service';
import { ConfigService } from './app/services/config.service';
import { APP_CONFIG } from './app/services/config';
import { environment } from './environments/environment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class App implements OnInit {
  private themeService = inject(ThemeService);
  private configService = inject(ConfigService);

  async ngOnInit() {
    await this.configService.loadConfig();
  }
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    { provide: APP_CONFIG, useValue: environment.apiEndpointConfig },
  
  ]
});
