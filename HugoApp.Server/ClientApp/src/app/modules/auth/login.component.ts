import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',  // Component's selector
  templateUrl: './login.component.html',  // HTML template for the login view
  styleUrls: ['./login.component.scss'],  // Component's styles
  standalone: true,  // Marks component as standalone
  imports: [FormsModule, CommonModule],  // Imports necessary modules
})
export class LoginComponent {
  username = '';  // Stores the entered username
  password = '';  // Stores the entered password
  errorMessage = '';  // Error message to show on failed login

  constructor(private authService: AuthService, private router: Router) { }

  // Handles the login form submission
  login(): void {
    console.log('Attempting login with:', this.username, this.password);
    if (this.authService.login(this.username, this.password)) {  // Validate credentials
      this.errorMessage = '';  // Clear error if login succeeds
      this.router.navigate(['/inlägg']);  // Redirect to posts page
    } else {
      this.errorMessage = 'Fel användarnamn eller lösenord!';  // Set error message on failure
      console.log('Login failed: Invalid credentials');
    }
  }

}
