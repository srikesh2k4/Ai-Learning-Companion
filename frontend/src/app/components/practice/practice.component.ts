import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LearningService } from '../../services/learning.service';
import { GeneratedProblem, PracticeSession, SubmitAnswerResponse } from '../../models/types';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './practice.component.html',
  styleUrl: './practice.component.scss'
})
export class PracticeComponent implements OnInit {
  topics: string[] = [];
  selectedTopic = '';
  selectedDifficulty: 'easy' | 'medium' | 'hard' = 'easy';
  difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];

  generating = false;
  submitting = false;
  showHints = false;
  showFeedback = false;

  currentProblem: GeneratedProblem | null = null;
  userAnswer = '';
  feedback: SubmitAnswerResponse | null = null;
  history: PracticeSession[] = [];
  private platformId = inject(PLATFORM_ID);

  constructor(private learningService: LearningService) {}

  ngOnInit(): void {
    // Only load data in browser
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadTopics();
    this.loadHistory();
  }

  loadTopics(): void {
    this.learningService.getTopics().subscribe({
      next: (response) => {
        this.topics = response.topics;
      },
      error: (err) => console.error('Failed to load topics', err)
    });
  }

  loadHistory(): void {
    this.learningService.getPracticeHistory().subscribe({
      next: (history) => {
        this.history = history.slice(0, 5);
      },
      error: (err) => console.error('Failed to load history', err)
    });
  }

  generateProblem(): void {
    if (!this.selectedTopic) return;

    this.generating = true;

    this.learningService.generateProblem({
      topic: this.selectedTopic,
      difficulty: this.selectedDifficulty
    }).subscribe({
      next: (problem) => {
        this.currentProblem = problem;
        this.generating = false;
        this.showHints = false;
      },
      error: (err) => {
        console.error('Failed to generate problem', err);
        this.generating = false;
      }
    });
  }

  submitAnswer(): void {
    if (!this.userAnswer.trim() || !this.currentProblem) return;

    this.submitting = true;

    this.learningService.submitAnswer(
      this.currentProblem.session_id,
      this.userAnswer
    ).subscribe({
      next: (response) => {
        this.feedback = response;
        this.showFeedback = true;
        this.submitting = false;
        this.loadHistory();
      },
      error: (err) => {
        console.error('Failed to submit answer', err);
        this.submitting = false;
      }
    });
  }

  cancelProblem(): void {
    this.currentProblem = null;
    this.userAnswer = '';
    this.showHints = false;
  }

  tryAnother(): void {
    this.currentProblem = null;
    this.userAnswer = '';
    this.feedback = null;
    this.showFeedback = false;
    this.showHints = false;
  }

  viewHistory(): void {
    this.showFeedback = false;
    this.currentProblem = null;
    this.userAnswer = '';
    this.feedback = null;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }
}
