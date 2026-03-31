import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface UserProfile {
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  isEditing = signal(false);
  saving = signal(false);

  profile = signal<UserProfile>({
    full_name: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    phone: '+33 6 12 34 56 78',
    date_of_birth: '1990-01-15',
    gender: 'male'
  });

  originalProfile = signal<UserProfile>({ ...this.profile() });

  genderOptions = [
    { value: 'male', label: 'Homme', icon: '👨' },
    { value: 'female', label: 'Femme', icon: '👩' },
  ];

  getGenderLabel(gender: string): string {
    return this.genderOptions.find(g => g.value === gender)?.label || 'Non spécifié';
  }

  toggleEdit(): void {
    if (this.isEditing()) {
      this.profile.set({ ...this.originalProfile() });
      this.isEditing.set(false);
    } else {
      this.originalProfile.set({ ...this.profile() });
      this.isEditing.set(true);
    }
  }

  selectGender(gender: string): void {
    this.profile.update(p => ({ ...p, gender }));
  }

  async saveProfile(): Promise<void> {
    this.saving.set(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    this.originalProfile.set({ ...this.profile() });
    this.saving.set(false);
    this.isEditing.set(false);
  }

  cancelEdit(): void {
    this.profile.set({ ...this.originalProfile() });
    this.isEditing.set(false);
  }
}
