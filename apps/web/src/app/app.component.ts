import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { LoginComponent } from './features/auth/login.component';
import { AuthService } from './core/auth.service';
import { TranslationService } from './core/translation.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'EcoCommune';

  constructor(
    public authService: AuthService,
    public translationService: TranslationService,
  ) {}
}
