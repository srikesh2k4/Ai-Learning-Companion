import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { catchError, map } from 'rxjs/operators';

export interface AgentRecommendation {
  quick_tip: string;
  suggestion: string;
  estimated_time: string;
  priority: 'low' | 'medium' | 'high';
  action_type: 'practice' | 'review' | 'learn' | 'break';
  stats: {
    total_conversations: number;
    total_practice_sessions: number;
    practice_sessions_completed: number;
    average_score: number;
    topics_practiced: string[];
  } | null;
}

export interface AgentChatResponse {
  message: string;
  suggestions?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AiAgentService {
  private apiUrl = 'http://localhost:8000/api';
  private platformId = inject(PLATFORM_ID);

  private contextSubject = new BehaviorSubject<any>(null);
  public context$ = this.contextSubject.asObservable();

  constructor(private http: HttpClient) {}

  getRecommendation(currentRoute: string): Observable<AgentRecommendation> {
    if (!isPlatformBrowser(this.platformId)) {
      return of(this.getDefaultRecommendation());
    }

    return this.http.post<AgentRecommendation>(
      `${this.apiUrl}/agent/recommendation`,
      { current_route: currentRoute }
    ).pipe(
      catchError(() => of(this.getContextualFallback(currentRoute)))
    );
  }

  chat(message: string, currentRoute: string): Observable<AgentChatResponse> {
    return this.http.post<AgentChatResponse>(
      `${this.apiUrl}/agent/chat`,
      { message, current_route: currentRoute }
    );
  }

  private getDefaultRecommendation(): AgentRecommendation {
    return {
      quick_tip: 'Ready to help you learn!',
      suggestion: 'Start a conversation or try a practice problem.',
      estimated_time: '15 mins',
      priority: 'medium',
      action_type: 'learn',
      stats: null
    };
  }

  private getContextualFallback(route: string): AgentRecommendation {
    const recommendations: Record<string, AgentRecommendation> = {
      '/chat': {
        quick_tip: 'Ask me anything you want to learn!',
        suggestion: 'Start a new conversation to explore any topic.',
        estimated_time: '10-20 mins',
        priority: 'medium',
        action_type: 'learn',
        stats: null
      },
      '/practice': {
        quick_tip: 'Practice makes perfect! Try a problem.',
        suggestion: 'Generate a practice problem to test your knowledge.',
        estimated_time: '15-30 mins',
        priority: 'high',
        action_type: 'practice',
        stats: null
      },
      '/profile': {
        quick_tip: 'Keep your profile updated for better recommendations!',
        suggestion: 'Set your learning goals and preferred topics.',
        estimated_time: '5 mins',
        priority: 'low',
        action_type: 'review',
        stats: null
      },
      '/': {
        quick_tip: 'Welcome back! Ready to learn something new?',
        suggestion: 'Check your dashboard for progress and start learning.',
        estimated_time: '20-30 mins',
        priority: 'medium',
        action_type: 'learn',
        stats: null
      }
    };

    return recommendations[route] || this.getDefaultRecommendation();
  }

  updateContext(context: any): void {
    this.contextSubject.next(context);
  }
}
