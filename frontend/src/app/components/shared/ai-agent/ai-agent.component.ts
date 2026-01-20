import { Component, OnInit, OnDestroy, PLATFORM_ID, inject, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, interval, filter } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';
import { AiAgentService, AgentRecommendation, AgentChatResponse } from "../../../services/ai-agent.service"
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-ai-agent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-agent.component.html',
  styleUrl: './ai-agent.component.scss'
})
export class AiAgentComponent implements OnInit, OnDestroy, AfterViewInit {
  state: 'idle' | 'listening' | 'thinking' | 'speaking' = 'idle';
  isExpanded = false;
  isMinimized = false;

  currentSuggestion = '';
  messages: { role: 'user' | 'agent'; content: string }[] = [];
  userInput = '';
  isLoading = false;

  recommendation: AgentRecommendation | null = null;
  currentRoute = '';

  // Drag state
  isDragging = false;
  dragPosition = { x: 0, y: 0 };
  private dragOffset = { x: 0, y: 0 };
  private hasMoved = false;

  @ViewChild('agentContainer') agentContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('minimizedAgent') minimizedAgent!: ElementRef<HTMLDivElement>;

  private platformId = inject(PLATFORM_ID);
  private subscriptions: Subscription[] = [];
  private suggestionInterval: Subscription | null = null;
  private aiAgentService = inject(AiAgentService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  constructor() {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  }

  parseMarkdown(text: string): SafeHtml {
    try {
      const html = marked.parse(text) as string;
      return this.sanitizer.bypassSecurityTrustHtml(html);
    } catch {
      return text;
    }
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (!this.authService.isAuthenticated()) return;

    // Track route changes
    this.subscriptions.push(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
        this.loadContextualRecommendation();
      })
    );

    // Initial load
    this.currentRoute = this.router.url;
    this.loadContextualRecommendation();

    // Refresh recommendations periodically
    this.suggestionInterval = interval(300000).subscribe(() => {
      if (!this.isExpanded) {
        this.loadContextualRecommendation();
      }
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Set initial position from bottom-right
    this.resetPosition();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.suggestionInterval?.unsubscribe();
  }

  loadContextualRecommendation(): void {
    if (!this.authService.isAuthenticated()) return;

    this.state = 'thinking';

    this.aiAgentService.getRecommendation(this.currentRoute).subscribe({
      next: (rec: AgentRecommendation) => {
        this.recommendation = rec;
        this.currentSuggestion = rec.quick_tip;
        this.state = 'idle';
      },
      error: () => {
        this.currentSuggestion = 'Ready to help you learn!';
        this.state = 'idle';
      }
    });
  }

  toggleExpand(): void {
    if (this.isMinimized) {
      this.isMinimized = false;
      return;
    }

    this.isExpanded = !this.isExpanded;

    if (this.isExpanded && this.messages.length === 0 && this.recommendation) {
      this.messages.push({
        role: 'agent',
        content: this.getWelcomeMessage()
      });
    }
  }

  minimize(): void {
    this.isExpanded = false;
    this.isMinimized = true;
  }

  close(): void {
    this.isExpanded = false;
    this.isMinimized = false;
  }

  sendMessage(): void {
    if (!this.userInput.trim() || this.isLoading) return;

    const userMessage = this.userInput.trim();
    this.messages.push({ role: 'user', content: userMessage });
    this.userInput = '';
    this.isLoading = true;
    this.state = 'thinking';

    this.aiAgentService.chat(userMessage, this.currentRoute).subscribe({
      next: (response: AgentChatResponse) => {
        this.messages.push({ role: 'agent', content: response.message });
        this.isLoading = false;
        this.state = 'speaking';

        setTimeout(() => {
          this.state = 'idle';
        }, 2000);
      },
      error: () => {
        this.messages.push({
          role: 'agent',
          content: 'Sorry, I encountered an error. Please try again.'
        });
        this.isLoading = false;
        this.state = 'idle';
      }
    });
  }

  private getWelcomeMessage(): string {
    if (!this.recommendation) {
      return "Hi! I'm your AI learning companion. How can I help you today?";
    }

    const { stats, suggestion, estimated_time } = this.recommendation;

    let message = `Hi! Here's your learning summary:\n\n`;

    if (stats) {
      message += `📊 **Your Progress:**\n`;
      message += `• ${stats.total_conversations} conversations\n`;
      message += `• ${stats.total_practice_sessions} practice sessions\n`;
      if (stats.average_score > 0) {
        message += `• Average score: ${stats.average_score.toFixed(1)}%\n`;
      }
      message += '\n';
    }

    message += `💡 **Today's Suggestion:**\n${suggestion}\n\n`;

    if (estimated_time) {
      message += `⏱️ Estimated time: ${estimated_time}\n\n`;
    }

    message += 'Feel free to ask me anything about your learning journey!';

    return message;
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  // ========== DRAG FUNCTIONALITY ==========

  private resetPosition(): void {
    // Default position: bottom-right corner
    this.dragPosition = { x: 0, y: 0 };
  }

  onDragStart(event: MouseEvent | TouchEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    event.preventDefault();
    this.isDragging = true;
    this.hasMoved = false;

    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    // Calculate offset from current position
    this.dragOffset = {
      x: clientX - this.dragPosition.x,
      y: clientY - this.dragPosition.y
    };

    // Add global listeners
    document.addEventListener('mousemove', this.onDragMove);
    document.addEventListener('mouseup', this.onDragEnd);
    document.addEventListener('touchmove', this.onDragMove, { passive: false });
    document.addEventListener('touchend', this.onDragEnd);
  }

  onDragMove = (event: MouseEvent | TouchEvent): void => {
    if (!this.isDragging) return;

    event.preventDefault();

    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    const newX = clientX - this.dragOffset.x;
    const newY = clientY - this.dragOffset.y;

    // Check if moved enough to count as drag (not just click)
    if (Math.abs(newX - this.dragPosition.x) > 5 || Math.abs(newY - this.dragPosition.y) > 5) {
      this.hasMoved = true;
    }

    // Get viewport bounds
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const agentSize = 100; // Approximate size including suggestion bubble area

    // Constrain to viewport
    this.dragPosition = {
      x: Math.max(-viewportWidth + agentSize, Math.min(0, newX)),
      y: Math.max(-viewportHeight + agentSize, Math.min(0, newY))
    };
  };

  onDragEnd = (): void => {
    this.isDragging = false;

    // Remove global listeners
    document.removeEventListener('mousemove', this.onDragMove);
    document.removeEventListener('mouseup', this.onDragEnd);
    document.removeEventListener('touchmove', this.onDragMove);
    document.removeEventListener('touchend', this.onDragEnd);
  };

  onAgentClick(): void {
    // Only toggle expand if we didn't drag
    if (!this.hasMoved) {
      this.toggleExpand();
    }
    this.hasMoved = false;
  }
}
