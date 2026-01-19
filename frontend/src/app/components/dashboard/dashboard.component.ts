import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LearningService } from '../../services/learning.service';
import { User, LearningStats, Conversation } from '../../models/types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  stats: LearningStats | null = null;
  recentConversations: Conversation[] = [];
  loading = true;
  private platformId = inject(PLATFORM_ID);

  constructor(
    private authService: AuthService,
    private learningService: LearningService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();

    // Only load data in browser
    if (isPlatformBrowser(this.platformId)) {
      this.loadDashboardData();
    } else {
      this.loading = false;
    }
  }

  loadDashboardData(): void {
    this.loading = true;
    console.log('Loading dashboard data...');

    // Load stats
    this.learningService.getStats().subscribe({
      next: (stats) => {
        console.log('Stats loaded:', stats);
        this.stats = stats;
      },
      error: (err) => {
        console.error('Failed to load stats', err);
        console.log('Stats error status:', err.status);
      }
    });

    // Load recent conversations
    this.learningService.getConversations().subscribe({
      next: (conversations) => {
        console.log('Conversations loaded:', conversations);
        this.recentConversations = conversations.slice(0, 5);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load conversations', err);
        console.log('Conversations error status:', err.status);
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }
}
