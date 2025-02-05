import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(): boolean {
    const loggedIn = this.authService.isLoggedIn();
    console.log('Checking if user is logged in:', loggedIn);

    if (loggedIn) {
      return true;
    } else {
      console.log('Not logged in. Redirecting to /login');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
