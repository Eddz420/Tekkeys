import { Component, signal, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SnackbarService } from '../../services/snackbar.service';
import { AuthenticationOdooService } from '../../services/auth.service';

type ModalView = 'login' | 'signup-step1' | 'signup-step2' | 'forgot-password';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss'
})
export class LoginModalComponent {
  closeModal = output<void>();
  snackbarService = inject(SnackbarService);
  private authService = inject(AuthenticationOdooService);

  currentView = signal<ModalView>('login');

  // ✅ NEW: error state
  loginError = signal<string | null>(null);

  loginEmail = '';
  loginPassword = '';

  signupNom = '';
  signupPrenom = '';
  signupEmail = '';
  signupPassword = '';
  signupConfirmPassword = '';
  agreeToTerms = false;

  forgotEmail = '';

  close(): void {
    this.closeModal.emit();
  }

  switchView(view: ModalView): void {
    this.currentView.set(view);
    this.loginError.set(null); // reset error on view change
  }

  onLogin(): void {
    // reset error before trying again
    this.loginError.set(null);

    this.authService.login(this.loginEmail, this.loginPassword, "wiunivers_dev")
      .subscribe(success => {
        if (success) {
          this.snackbarService.success('Connexion réussie');
          this.close();
        } else {
          // ✅ SET ERROR MESSAGE
          this.loginError.set('Email ou mot de passe incorrect');
        }
      });
  }

  onSignupStep1(): void {
    this.currentView.set('signup-step2');
  }

  onSignupStep2(): void {
    console.log('Signup:', this.signupNom, this.signupPrenom, this.signupEmail, this.signupPassword);
    this.snackbarService.success('Inscription réussie');
    this.close();
  }

  onForgotPassword(): void {
    console.log('Forgot password:', this.forgotEmail);
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }
}