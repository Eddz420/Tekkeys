import { Component, inject } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent {
  configService = inject(ConfigService);
  currentYear = new Date().getFullYear();
}
