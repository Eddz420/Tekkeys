import { Component, inject } from '@angular/core';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent {
  configService = inject(ConfigService);
  currentYear = new Date().getFullYear();
}
