import { CardHeaderComponent } from '@/shared/card/card-header/card-header.component';
import { CardComponent } from '@/shared/card/card.component';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
  ],
  templateUrl: './therapist-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TherapistComponent {
  private readonly therapyService = inject(TherapyService);

  feature = computed(() => ({
      "name": "On-device Therapist",
      "description": "An AI-powered, privacy-focused mental health assistant that provides real-time emotional support and therapeutic guidance"
  }));

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

  async handleSendPrompt(prompt: string): Promise<void> {
    this.isLoading.set(true);

    const lastMessageId = this.messages().length ? this.messages()[this.messages().length - 1].id : 0;
    const { aiMessageId, pair } = makeAIResponsePair(prompt, lastMessageId);
    this.messages.update(messages => ([...messages, ...pair]));

    try {
      const answer = await this.therapyService.promptText(prompt);
      this.messages.update(messages => {
        return messages.map(message => message.id !== aiMessageId  ?
          message : makeSuccessMessage(message, answer)
        );
      });
    } catch (e) {
      const errorMessage =  e instanceof Error ? e.message: 'An unexpected error occurred in converational image editing.';
      this.messages.update(messages => {
        return messages.map(message => message.id !== aiMessageId ? message :
          makeErrorMessage(message, errorMessage));
      });
    } finally {
      this.isLoading.set(false);
    }
  }

   async toggleConversation() {
      const currentEditing = this.isEditing();
      // not editing to editing
      if (!currentEditing) {
        // this.therapyService.startEdit();
        await this.therapyService.createSession();
      } else {
        // editing to not editing
        // this.therapyService.endEdit();
        this.messages.set([]);
      }
      this.isEditing.update((prev) => !prev);
  }
}
