import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/types';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  updating = false;
  successMessage = '';
  errorMessage = '';

  formData = {
    full_name: '',
    email: '',
    learning_goals: '',
    preferred_topics: [] as string[]
  };

  availableTopics = [
    'Python Programming',
    'Data Structures',
    'Algorithms',
    'Web Development',
    'Machine Learning',
    'Database Design',
    'System Design',
    'Mathematics',
    'Statistics'
  ];

  private platformId = inject(PLATFORM_ID);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Only load data in browser
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.formData = {
        full_name: this.currentUser.full_name,
        email: this.currentUser.email,
        learning_goals: this.currentUser.learning_goals || '',
        preferred_topics: this.currentUser.preferred_topics || []
      };
    }
  }

  updateProfile(): void {
    this.updating = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.updateProfile({
      full_name: this.formData.full_name,
      email: this.formData.email
    }).subscribe({
      next: () => {
        this.successMessage = 'Profile updated successfully!';
        this.updating = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err: { error?: { detail?: string } }) => {
        this.errorMessage = err.error?.detail || 'Failed to update profile';
        this.updating = false;
      }
    });
  }

  updateGoals(): void {
    this.updating = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.updateProfile({
      learning_goals: this.formData.learning_goals,
      preferred_topics: this.formData.preferred_topics
    }).subscribe({
      next: () => {
        this.successMessage = 'Learning goals updated successfully!';
        this.updating = false;
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: (err: { error?: { detail?: string } }) => {
        this.errorMessage = err.error?.detail || 'Failed to update goals';
        this.updating = false;
      }
    });
  }

  isTopicSelected(topic: string): boolean {
    return this.formData.preferred_topics.includes(topic);
  }

  toggleTopic(topic: string): void {
    const index = this.formData.preferred_topics.indexOf(topic);
    if (index > -1) {
      this.formData.preferred_topics.splice(index, 1);
    } else {
      this.formData.preferred_topics.push(topic);
    }
  }

  confirmLogout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.authService.logout();
    }
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  }
}
