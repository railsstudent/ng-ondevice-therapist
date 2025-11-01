import { CardHeaderComponent } from '@/shared/card/card-header/card-header.component';
import { CardComponent } from '@/shared/card/card.component';
import { LoaderComponent } from '@/shared/loader/loader.component';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { marked } from 'marked';
import { from } from 'rxjs';
import { makeAIResponsePair, makeErrorMessage, makeSuccessMessage } from './helpers/message.helper';
import { TherapyService } from './services/therapy.service';
import { TherapistInputFormComponent } from './therapist-input-form/therapist-input-form.component';
import { TherapistMessagesComponent } from './therapist-messages/therapist-messages.component';
import { ChatMessage } from './types/chat-message.type';

@Component({
  selector: 'app-conversation-edit',
  imports: [
    CardComponent,
    CardHeaderComponent,
    TherapistMessagesComponent,
    TherapistInputFormComponent,
    LoaderComponent
  ],
  templateUrl: './therapist-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TherapistComponent {
  private readonly therapyService = inject(TherapyService);

  canUseChromeBuiltInAI = toSignal(
    from(this.therapyService.testChromeBuiltInAI()),
    { initialValue: false }
  );

  isEditing = signal(false);
  btnTherapyText = computed(() => {
    const action = this.isEditing() ? 'End' : 'Start';
    return `${action} Therapy`;
  });

  isTherapyDisabled = computed(() => this.messages().length < 0);
  isLoading = signal(false);

  messages = signal<ChatMessage[]>([]);
  prompt = signal('');
  aiMessages = computed(() => this.messages()
    .filter((message) => message.sender === 'AI')
    .map((message) => message.text));

  therapistSummary = signal('');
  isSummarizing = signal(false);

  async handleSendPrompt(rawPrompt: string): Promise<void> {
    this.isLoading.set(true);

    const prompt = await this.therapyService.proofreadPrompt(rawPrompt);

    const lastMessageId = this.messages().length ? this.messages()[this.messages().length - 1].id : 0;
    const { aiMessageId, pair } = makeAIResponsePair(prompt, lastMessageId);
    this.messages.update(messages => ([...messages, ...pair]));

    try {
      const answer = await this.therapyService.promptText(prompt);
      const htmlText = await marked.parse(answer);
      this.messages.update(messages => {
        return messages.map(message => message.id !== aiMessageId  ?
          message : makeSuccessMessage(message, htmlText)
        );
      });
    } catch (e) {
      const errorMessage =  e instanceof Error ? e.message: 'An unexpected error occurred in converational image editing.';
      this.messages.update(messages => {
        return messages.map(message => message.id !== aiMessageId ? message :
          makeErrorMessage(message, errorMessage));
      });
    } finally {
      this.prompt.set('');
      this.isLoading.set(false);
    }
  }

  async toggleConversation() {
      const currentEditing = this.isEditing();
      // not editing to editing
      if (!currentEditing) {
        this.therapistSummary.set('');
        await this.therapyService.createSession();
        this.messages.set([
          {
            id: 1,
            sender: 'AI',
            text: 'Do you have any problem to discuss today?',
            isLoading: false,
            isError: undefined,
          }
        ]);
      } else {
        this.isSummarizing.set(true);
        const summary = await this.therapyService.generateSummaries(this.aiMessages());
        this.therapistSummary.set(summary);
        this.isSummarizing.set(false);
        await this.therapyService.destroySession();
        this.messages.set([]);
      }
      this.isEditing.update((prev) => !prev);
  }
}
