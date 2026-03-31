import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Address } from '../../services/address.service';

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './address-form.component.html',
  styleUrl: './address-form.component.scss'
})
export class AddressFormComponent {
  @Input() address: Address | null = null;
  @Output() save = new EventEmitter<Address>();
  @Output() cancel = new EventEmitter<void>();

  formData = signal<Address>({
    label: 'Maison',
    full_name: '',
    street_address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'France',
    phone: '',
    is_default: false
  });

  detecting = signal(false);
  locationError = signal<string>('');

  labelOptions = [
    { value: 'Maison', label: 'Maison', icon: '🏠' },
    { value: 'Travail', label: 'Travail', icon: '💼' },
    { value: 'Autre', label: 'Autre', icon: '📍' }
  ];

  ngOnInit() {
    if (this.address) {
      this.formData.set({ ...this.address });
    }
  }

  selectLabel(label: string) {
    this.formData.update(data => ({ ...data, label }));
  }

  async detectLocation() {
    if (!navigator.geolocation) {
      this.locationError.set('La géolocalisation n\'est pas supportée par votre navigateur');
      return;
    }

    this.detecting.set(true);
    this.locationError.set('');

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'fr'
          }
        }
      );

      if (!response.ok) throw new Error('Erreur lors de la récupération de l\'adresse');

      const data = await response.json();
      const addr = data.address;

      this.formData.update(current => ({
        ...current,
        street_address: `${addr.house_number || ''} ${addr.road || addr.street || ''}`.trim(),
        city: addr.city || addr.town || addr.village || '',
        postal_code: addr.postcode || '',
        state: addr.state || addr.region || '',
        country: addr.country || 'France'
      }));

    } catch (error: any) {
      console.error('Geolocation error:', error);
      if (error.code === 1) {
        this.locationError.set('Permission de localisation refusée');
      } else if (error.code === 2) {
        this.locationError.set('Position indisponible');
      } else if (error.code === 3) {
        this.locationError.set('Délai d\'attente dépassé');
      } else {
        this.locationError.set('Impossible de récupérer votre adresse');
      }
    } finally {
      this.detecting.set(false);
    }
  }

  onSubmit() {
    this.save.emit(this.formData());
  }

  onCancel() {
    this.cancel.emit();
  }
}
