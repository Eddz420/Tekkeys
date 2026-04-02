import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthenticationOdooService } from '../../services/auth.service';

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
export class ProfileComponent implements OnInit {
  private authService = inject(AuthenticationOdooService);

  isEditing = signal(false);
  saving = signal(false);

  profile = signal<UserProfile>({
    full_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: ''
  });

  originalProfile = signal<UserProfile>({ ...this.profile() });

  genderOptions = [
    { value: 'male', label: 'Homme', icon: '👨' },
    { value: 'female', label: 'Femme', icon: '👩' },
  ];

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.authService.getSessionInfo().subscribe(sessionInfo => {
      if (sessionInfo) {
        this.profile.set({
          full_name: sessionInfo.partner_display_name || sessionInfo.name || '',
          email: sessionInfo.username || '',
          phone: '', // Not available in session info
          date_of_birth: '', // Not available in session info
          gender: '' // Not available in session info
        });
        this.originalProfile.set({ ...this.profile() });
      }
    });
  }



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
