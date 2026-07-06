import { Injectable, signal } from '@angular/core';
import { UserProfile, LanguageCode } from '../../../../../libs/shared-types';

/**
 * Core AuthService managing user identity and authentication state.
 * Interfaces with Firebase Authentication (Google Sign-In + Email Link).
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Reactive signal holding current authenticated user profile.
   */
  readonly currentUser = signal<UserProfile | null>({
    uid: 'demo_user_123',
    email: 'resident@ecocommune.org',
    displayName: 'Aarav Patel',
    householdId: 'demo_user_123',
    neighborhoodId: 'green-valley-subdivision',
    preferredLanguage: 'en',
    createdAt: new Date().toISOString(),
  });

  readonly isAuthenticated = signal<boolean>(true);

  /**
   * Triggers Google Sign-In via Firebase Auth SDK.
   */
  async loginWithGoogle(): Promise<void> {
    // In production: await signInWithPopup(this.auth, new GoogleAuthProvider());
    this.currentUser.set({
      uid: 'google_user_789',
      email: 'aarav.patel@gmail.com',
      displayName: 'Aarav Patel (Google)',
      householdId: 'google_user_789',
      neighborhoodId: 'green-valley-subdivision',
      preferredLanguage: 'en',
      createdAt: new Date().toISOString(),
    });
    this.isAuthenticated.set(true);
  }

  /**
   * Triggers Email Link (Passwordless) authentication.
   * @param email Target user email address
   */
  async sendEmailLink(email: string): Promise<void> {
    // In production: await sendSignInLinkToEmail(this.auth, email, actionCodeSettings);
    console.log(`[Firebase Auth] Sent email sign-in link to ${email}`);
  }

  /**
   * Signs out current user session.
   */
  async logout(): Promise<void> {
    // In production: await signOut(this.auth);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  /**
   * Updates preferred UI language preference.
   * @param lang LanguageCode ('en' | 'hi' | 'mr')
   */
  updateLanguage(lang: LanguageCode): void {
    const current = this.currentUser();
    if (current) {
      this.currentUser.set({ ...current, preferredLanguage: lang });
    }
  }
}
