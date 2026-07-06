import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { TranslationService } from '../../core/translation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container glass-panel" role="main" aria-labelledby="login-title">
      <div class="brand-header">
        <span class="logo">🌿</span>
        <h1 id="login-title">EcoCommune</h1>
        <p>{{ translationService.translate('app.subtitle') }}</p>
      </div>

      <!-- Credentials Login Form -->
      <form (ngSubmit)="onSubmit()" #loginForm="ngForm" aria-label="Sign In Form" class="login-form">
        <div class="form-group">
          <label for="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            name="email"
            class="form-control"
            [(ngModel)]="email"
            required
            email
            aria-required="true"
            placeholder="e.g. mayur.makwana@gmail.com"
          />
        </div>

        <div class="form-group">
          <label for="login-pass">Password</label>
          <input
            id="login-pass"
            type="password"
            name="password"
            class="form-control"
            [(ngModel)]="password"
            required
            aria-required="true"
            placeholder="Password (Hint: password123)"
          />
        </div>

        <div class="error-msg" *ngIf="error" role="alert" aria-live="polite">
          ⚠️ {{ error }}
        </div>

        <button type="submit" class="btn-primary w-full" [disabled]="!loginForm.form.valid">
          🔓 Sign In
        </button>
      </form>

      <div class="divider">
        <span>OR</span>
      </div>

      <!-- Google Sign In Simulation -->
      <button type="button" class="btn-secondary w-full google-btn" (click)="onGoogleLogin()">
        <span class="g-icon">🌐</span> Sign In with Google
      </button>

      <!-- Demo Info Card -->
      <div class="demo-card glass-panel">
        <h3>💡 Demo Account Credentials</h3>
        <p>Use the following details to login directly:</p>
        <div class="creds-box">
          <div><strong>Email:</strong> <code>mayur.makwana&#64;gmail.com</code></div>
          <div><strong>Password:</strong> <code>password123</code></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 440px;
      margin: 80px auto;
      padding: 32px;
      text-align: center;
    }
    .brand-header {
      margin-bottom: 24px;
    }
    .logo {
      font-size: 2.5rem;
    }
    .brand-header h1 {
      font-size: 2rem;
      margin-top: 8px;
      margin-bottom: 4px;
    }
    .brand-header p {
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    .login-form {
      text-align: left;
      margin-top: 20px;
    }
    .w-full {
      width: 100%;
    }
    .error-msg {
      color: #ff1744;
      font-size: 0.85rem;
      margin-bottom: 12px;
      font-weight: 500;
    }
    .divider {
      position: relative;
      margin: 20px 0;
      text-align: center;
    }
    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
      z-index: 1;
    }
    .divider span {
      position: relative;
      background: #111b27;
      padding: 0 10px;
      font-size: 0.8rem;
      color: var(--text-secondary);
      z-index: 2;
    }
    .google-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .demo-card {
      margin-top: 28px;
      padding: 16px;
      background: rgba(0, 230, 118, 0.04);
      border-color: rgba(0, 230, 118, 0.15);
      text-align: left;
    }
    .demo-card h3 {
      font-size: 0.95rem;
      color: var(--primary-color);
      margin-bottom: 6px;
    }
    .demo-card p {
      font-size: 0.8rem;
      margin-bottom: 8px;
    }
    .creds-box {
      font-size: 0.8rem;
      background: rgba(0, 0, 0, 0.2);
      padding: 10px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .creds-box code {
      color: var(--primary-color);
      font-family: monospace;
    }
  `],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(
    private authService: AuthService,
    public translationService: TranslationService,
  ) {}

  async onSubmit(): Promise<void> {
    this.error = '';
    const success = await this.authService.loginWithCredentials(this.email, this.password);
    if (!success) {
      this.error = 'Invalid email or password. Please use the demo account credentials.';
    }
  }

  async onGoogleLogin(): Promise<void> {
    await this.authService.loginWithGoogle();
  }
}
