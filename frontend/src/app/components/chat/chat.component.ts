import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, AfterViewInit, PLATFORM_ID, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LearningService } from '../../services/learning.service';
import { Message, Conversation } from '../../models/types';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  conversations: Conversation[] = [];
  currentConversation: Conversation | null = null;
  messages: Message[] = [];
  messageText = '';
  sendingMessage = false;
  private shouldScrollToBottom = false;
  showScrollButton = false;
  private isUserAtBottom = true;
  private platformId = inject(PLATFORM_ID);

  constructor(
    private learningService: LearningService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private sanitizer: DomSanitizer
  ) {
    marked.setOptions({
      breaks: true,
      gfm: true,
    });
  }

  parseMarkdown(text: string): SafeHtml {
    try {
      const html = marked.parse(text) as string;
      return this.sanitizer.bypassSecurityTrustHtml(html);
    } catch (error) {
      console.error('Markdown parsing error:', error);
      return text;
    }
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.loadConversations();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadConversation(+params['id']);
      }
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        if (this.messagesContainer && this.messages.length > 0) {
          this.checkScrollPosition();
        }
      }, 300);
    }
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom && this.messagesContainer) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;

      setTimeout(() => {
        this.checkScrollPosition();
      }, 100);
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
      error: (err) => {
        console.error('Failed to load conversations', err);
      }
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
        this.isUserAtBottom = true;
        this.showScrollButton = false;

        setTimeout(() => {
          this.checkScrollPosition();
        }, 300);
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
        this.isUserAtBottom = true;
        this.showScrollButton = false;
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
    this.isUserAtBottom = true;
    this.showScrollButton = false;

    const messageContent = this.messageText;
    this.messageText = '';
    this.sendingMessage = true;

    this.learningService.sendMessage(this.currentConversation.id, messageContent).subscribe({
      next: (response) => {
        this.messages.push(response);
        this.sendingMessage = false;

        setTimeout(() => {
          this.checkScrollPosition();

          if (this.isUserAtBottom) {
            this.shouldScrollToBottom = true;
            this.showScrollButton = false;
          } else {
            this.showScrollButton = true;
          }
          this.cdr.detectChanges();
        }, 50);

        this.updateConversationMessageCount();
      },
      error: (err) => {
        console.error('Failed to send message', err);
        this.sendingMessage = false;
      }
    });
  }

  private checkScrollPosition(): void {
    if (!this.messagesContainer) {
      return;
    }

    const element = this.messagesContainer.nativeElement;
    const threshold = 50;

    const scrollPosition = element.scrollTop + element.clientHeight;
    const scrollHeight = element.scrollHeight;
    const distanceFromBottom = scrollHeight - scrollPosition;

    this.isUserAtBottom = distanceFromBottom <= threshold;

    const shouldShow = !this.isUserAtBottom && this.messages.length > 0;

    if (this.showScrollButton !== shouldShow) {
      this.showScrollButton = shouldShow;
      this.cdr.detectChanges();
    }
  }

  onScroll(): void {
    this.ngZone.run(() => {
      this.checkScrollPosition();
    });
  }

  scrollToBottomClick(): void {
    this.scrollToBottom();

    setTimeout(() => {
      this.checkScrollPosition();
    }, 400);
  }

  updateConversationMessageCount(): void {
    if (this.currentConversation) {
      const conv = this.conversations.find(c => c.id === this.currentConversation!.id);
      if (conv) {
        conv.message_count = this.messages.length;
      }
      this.currentConversation.message_count = this.messages.length;
    }
  }

  scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTo({
          top: element.scrollHeight,
          behavior: 'smooth'
        });
      }
    } catch (err) {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    }
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  truncateTitle(title: string, maxLength: number = 25): string {
    if (!title) return 'New Conversation';
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  }

  deleteConversation(id: number, event: Event): void {
    event.stopPropagation();

    if (!confirm('Are you sure you want to delete this conversation?')) {
      return;
    }

    this.learningService.deleteConversation(id).subscribe({
      next: () => {
        this.conversations = this.conversations.filter(c => c.id !== id);

        if (this.currentConversation?.id === id) {
          this.currentConversation = null;
          this.messages = [];

          if (this.conversations.length > 0) {
            this.loadConversation(this.conversations[0].id);
          }
        }
      },
      error: (err) => console.error('Failed to delete conversation', err)
    });
  }
}
