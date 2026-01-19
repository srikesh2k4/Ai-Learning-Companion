import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LearningService } from '../../services/learning.service';
import { Message, Conversation } from '../../models/types';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  conversations: Conversation[] = [];
  currentConversation: Conversation | null = null;
  messages: Message[] = [];
  messageText = '';
  sendingMessage = false;
  private shouldScrollToBottom = false;
  private platformId = inject(PLATFORM_ID);

  constructor(
    private learningService: LearningService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Only load data in browser
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadConversations();

    // Check if conversation ID in route
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadConversation(+params['id']);
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  loadConversations(): void {
    this.learningService.getConversations().subscribe({
      next: (conversations) => {
        this.conversations = conversations;
        if (conversations.length > 0 && !this.currentConversation) {
          this.loadConversation(conversations[0].id);
        }
      },
      error: (err) => console.error('Failed to load conversations', err)
    });
  }

  loadConversation(id: number): void {
    this.learningService.getConversation(id).subscribe({
      next: (conversation) => {
        this.currentConversation = {
          id: conversation.id,
          title: conversation.title,
          topic: conversation.topic,
          created_at: conversation.created_at,
          message_count: conversation.messages.length
        };
        this.messages = conversation.messages;
        this.shouldScrollToBottom = true;
      },
      error: (err) => console.error('Failed to load conversation', err)
    });
  }

  createNewConversation(): void {
    this.learningService.createConversation('New Conversation').subscribe({
      next: (conversation) => {
        this.conversations.unshift(conversation);
        this.currentConversation = conversation;
        this.messages = [];
        this.messageText = '';
      },
      error: (err) => console.error('Failed to create conversation', err)
    });
  }

  sendMessage(): void {
    if (!this.messageText.trim() || !this.currentConversation || this.sendingMessage) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: this.messageText,
      created_at: new Date().toISOString()
    };

    this.messages.push(userMessage);
    this.shouldScrollToBottom = true;

    const messageContent = this.messageText;
    this.messageText = '';
    this.sendingMessage = true;

    this.learningService.sendMessage(this.currentConversation.id, messageContent).subscribe({
      next: (response) => {
        this.messages.push(response);
        this.sendingMessage = false;
        this.shouldScrollToBottom = true;
      },
      error: (err) => {
        console.error('Failed to send message', err);
        this.sendingMessage = false;
      }
    });
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      // Handle error silently
    }
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
