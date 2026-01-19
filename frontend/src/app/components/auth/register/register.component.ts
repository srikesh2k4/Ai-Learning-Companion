import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  formData = {
    username: '',
    email: '',
    full_name: '',
    password: '',
    learning_goals: ''
  };
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.formData.username || !this.formData.email ||
        !this.formData.full_name || !this.formData.password) {
      this.error = 'Please fill in all required fields';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.formData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err: { error?: { detail?: string } }) => {
        this.loading = false;
        this.error = err.error?.detail || 'Registration failed. Please try again.';
      }
    });
  }
}
