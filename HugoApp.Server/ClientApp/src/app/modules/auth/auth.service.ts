import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly authKey = 'isAuthenticated'; 

  constructor() {
    this.isAuthenticated = this.getAuthState();
  }

  private isAuthenticated = false;

  login(username: string, password: string): boolean {
    if (username === 'hugo' && password === 'dagboken min') { 
      this.isAuthenticated = true;
      localStorage.setItem(this.authKey, 'true'); 
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem(this.authKey); 
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated;
  }

  private getAuthState(): boolean {
    return localStorage.getItem(this.authKey) === 'true'; 
  }
}
