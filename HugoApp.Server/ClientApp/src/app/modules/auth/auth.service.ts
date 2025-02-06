import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // This makes the service available throughout the application
})
export class AuthService {
  private readonly authKey = 'isAuthenticated'; // Key for storing authentication state in localStorage

  constructor() {
    this.isAuthenticated = this.getAuthState(); // Initialize authentication state from localStorage
  }

  private isAuthenticated = false; // Tracks user authentication status

  // Simulated login function
  login(username: string, password: string): boolean {
    if (username === 'hugo' && password === 'dagboken min') { // Hardcoded credentials for authentication
      this.isAuthenticated = true;
      localStorage.setItem(this.authKey, 'true'); // Store authentication state in localStorage
      return true;
    }
    return false; // Return false if authentication fails
  }

  // Logs out the user and clears authentication data
  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem(this.authKey); // Remove authentication state from localStorage
  }

  // Checks if the user is currently logged in
  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  // Retrieves authentication state from localStorage
  private getAuthState(): boolean {
    return localStorage.getItem(this.authKey) === 'true'; // Convert stored value to boolean
  }
}
