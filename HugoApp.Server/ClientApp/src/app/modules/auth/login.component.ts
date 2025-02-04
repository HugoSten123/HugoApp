import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    console.log('Attempting login with:', this.username, this.password); 
    if (this.authService.login(this.username, this.password)) {
      this.errorMessage = ''; 
      this.router.navigate(['/inlägg']); 
    } else {
      this.errorMessage = 'Fel användarnamn eller lösenord!'; 
      console.log('Login failed: Invalid credentials'); 
    }
  }

}
