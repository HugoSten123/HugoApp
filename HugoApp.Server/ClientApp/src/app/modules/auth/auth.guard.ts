import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root', // This makes the service available application-wide
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  // Determines whether a route can be activated based on authentication status
  canActivate(): boolean {
    const loggedIn = this.authService.isLoggedIn(); // Check if the user is logged in
    console.log('Checking if user is logged in:', loggedIn);

    if (loggedIn) {
      return true; // Allow access if the user is logged in
    } else {
      console.log('Not logged in. Redirecting to /login');
      this.router.navigate(['/login']); // Redirect to login page if not authenticated
      return false; // Prevent route activation
    }
  }
}
