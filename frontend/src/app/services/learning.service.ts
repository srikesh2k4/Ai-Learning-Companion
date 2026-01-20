import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Conversation,
  ConversationDetail,
  Message,
  GenerateProblemRequest,
  GeneratedProblem,
  PracticeSession,
  LearningStats,
  SubmitAnswerResponse
} from '../models/types';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class LearningService {
  private apiUrl = API_CONFIG.BASE_URL + '/api';

  constructor(private http: HttpClient) {}

  // Conversation methods
  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/conversations`);
  }

  getConversation(id: number): Observable<ConversationDetail> {
    return this.http.get<ConversationDetail>(`${this.apiUrl}/conversations/${id}`);
  }

  createConversation(title?: string): Observable<Conversation> {
    return this.http.post<Conversation>(`${this.apiUrl}/conversations`, { title });
  }

  sendMessage(conversationId: number, content: string): Observable<Message> {
    return this.http.post<Message>(
      `${this.apiUrl}/conversations/${conversationId}/messages`,
      { content }
    );
  }

  deleteConversation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/conversations/${id}`);
  }

  // Practice
  generateProblem(request: GenerateProblemRequest): Observable<GeneratedProblem> {
    return this.http.post<GeneratedProblem>(`${this.apiUrl}/practice/generate`, request);
  }

  submitAnswer(sessionId: number, answer: string): Observable<SubmitAnswerResponse> {
    return this.http.post<SubmitAnswerResponse>(`${this.apiUrl}/practice/submit`, {
      session_id: sessionId,
      answer
    });
  }

  getPracticeHistory(): Observable<PracticeSession[]> {
    return this.http.get<PracticeSession[]>(`${this.apiUrl}/practice/history`);
  }

  // Stats
  getStats(): Observable<LearningStats> {
    return this.http.get<LearningStats>(`${this.apiUrl}/stats`);
  }

  // Topics
  getTopics(): Observable<{ topics: string[] }> {
    return this.http.get<{ topics: string[] }>(`${this.apiUrl}/topics`);
  }
}
