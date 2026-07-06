import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService } from '../../core/ai.service';
import { TranslationService } from '../../core/translation.service';
import { ChatMessage } from '../../../../../../libs/shared-types';

@Component({
  selector: 'app-chat-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="assistant-page glass-panel" aria-labelledby="assistant-heading">
      <div class="page-header">
        <h1 id="assistant-heading">{{ translationService.translate('assistant.title') }}</h1>
        <p>Grounded strictly in your household's logged resource data via Vertex AI SDK</p>
      </div>

      <div class="chat-container glass-panel">
        <!-- Preset Prompt Chips -->
        <div class="prompt-chips">
          <span class="chip-label">Quick Prompts:</span>
          <button type="button" class="chip-btn" (click)="onSelectChip('Why did my water bill spike?')">
            💧 Water Spike RAG Query
          </button>
          <button type="button" class="chip-btn" (click)="onSelectChip('How do I save energy in summer?')">
            ⚡ Summer Energy Tips
          </button>
          <button type="button" class="chip-btn" (click)="onSelectChip('Summarize my waste logs for this week')">
            ♻️ Waste Summary
          </button>
        </div>

        <!-- Chat History Window -->
        <div class="chat-messages" aria-live="polite" aria-label="Conversation History">
          <div
            *ngFor="let msg of messages"
            class="message-wrapper"
            [class.user-msg]="msg.sender === 'user'"
            [class.assistant-msg]="msg.sender === 'assistant'"
          >
            <div class="avatar" aria-hidden="true">
              {{ msg.sender === 'user' ? '👤' : '🤖' }}
            </div>
            <div class="message-bubble glass-panel">
              <div class="sender-name">
                {{ msg.sender === 'user' ? 'You' : 'EcoGemini RAG Assistant' }}
              </div>
              <p class="message-text">{{ msg.text }}</p>

              <!-- Grounding Sources Badge -->
              <div
                *ngIf="msg.groundedSources && msg.groundedSources.length > 0"
                class="grounding-sources"
              >
                <span class="g-title">VERIFIED GROUNDING SOURCES:</span>
                <div class="g-tags">
                  <span *ngFor="let src of msg.groundedSources" class="g-tag">
                    📄 {{ src.logDate }} - {{ src.amount }} {{ src.unit }} ({{ src.resourceType }})
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="isLoading" class="message-wrapper assistant-msg">
            <div class="avatar">🤖</div>
            <div class="message-bubble glass-panel loading-bubble">
              <span class="pulse-dot"></span> Analyzing your logged Firestore records...
            </div>
          </div>
        </div>

        <!-- Input Bar -->
        <form (ngSubmit)="onSendMessage()" class="chat-input-form">
          <input
            type="text"
            class="form-control chat-input"
            [(ngModel)]="userInput"
            name="userPrompt"
            [placeholder]="translationService.translate('assistant.placeholder')"
            [disabled]="isLoading"
            aria-label="Ask EcoGemini Assistant"
            required
          />
          <button
            type="submit"
            class="btn-primary send-btn"
            [disabled]="isLoading || !userInput.trim()"
          >
            {{ translationService.translate('assistant.send') }}
          </button>
        </form>
      </div>
    </section>
  `,
  styles: [`
    .chat-container {
      display: flex;
      flex-direction: column;
      height: 520px;
      margin-top: 16px;
      padding: 16px;
    }
    .prompt-chips {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .chip-label { font-size: 0.8rem; color: var(--text-secondary); }
    .chip-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: var(--text-primary);
      padding: 4px 10px;
      border-radius: 16px;
      font-size: 0.8rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .chip-btn:hover {
      background: rgba(0, 230, 118, 0.15);
      border-color: var(--primary-color);
    }
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding-right: 8px;
      margin-bottom: 16px;
    }
    .message-wrapper {
      display: flex;
      gap: 12px;
      max-width: 85%;
    }
    .message-wrapper.user-msg {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    .avatar { font-size: 1.4rem; }
    .message-bubble {
      padding: 12px 16px;
      border-radius: 12px;
    }
    .user-msg .message-bubble {
      background: rgba(0, 230, 118, 0.15);
      border-color: rgba(0, 230, 118, 0.3);
    }
    .sender-name {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-bottom: 4px;
      font-weight: 600;
    }
    .message-text {
      font-size: 0.95rem;
      line-height: 1.5;
      margin: 0;
    }
    .grounding-sources {
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px dashed rgba(255, 255, 255, 0.15);
    }
    .g-title {
      font-size: 0.65rem;
      color: var(--primary-color);
      letter-spacing: 0.05em;
      font-weight: 700;
    }
    .g-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }
    .g-tag {
      font-size: 0.7rem;
      background: rgba(0, 0, 0, 0.3);
      padding: 2px 6px;
      border-radius: 4px;
      color: var(--text-secondary);
    }
    .chat-input-form {
      display: flex;
      gap: 12px;
    }
    .chat-input { flex: 1; }
    .send-btn { white-space: nowrap; }
    .loading-bubble {
      color: var(--primary-color);
      font-size: 0.9rem;
    }
  `],
})
export class ChatAssistantComponent {
  userInput: string = '';
  isLoading: boolean = false;

  messages: ChatMessage[] = [
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Hello! I am EcoGemini, your conversational assistant grounded directly in your logged household data. Ask me about your energy spikes or savings tips!',
      timestamp: new Date().toISOString(),
    },
  ];

  constructor(
    private aiService: AiService,
    public translationService: TranslationService,
  ) {}

  onSelectChip(promptText: string): void {
    this.userInput = promptText;
    this.onSendMessage();
  }

  async onSendMessage(): Promise<void> {
    const text = this.userInput.trim();
    if (!text || this.isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    this.messages.push(userMsg);
    this.userInput = '';
    this.isLoading = true;

    try {
      const activeLang = this.translationService.currentLanguage();
      const response = await this.aiService.sendChatMessage(text, activeLang);
      this.messages.push(response);
    } finally {
      this.isLoading = false;
    }
  }
}
