import { CardHeaderComponent } from '@/shared/card/card-header/card-header.component';
import { CardComponent } from '@/shared/card/card.component';
import { GenMediaService } from '@/shared/gen-media/services/gen-media.service';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { GenerativeContentBlob } from 'firebase/ai';
import { from } from 'rxjs';
import { DEFAULT_BASE64_INLINE_DATA } from './constants/base64-inline-data.const';
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
  private readonly genMediaService = inject(GenMediaService);

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
  lastEditedImage = signal<GenerativeContentBlob>(DEFAULT_BASE64_INLINE_DATA.inlineData);

  async handleSendPrompt(prompt: string): Promise<void> {
    this.isLoading.set(true);

    const { aiMessageId, pair } = makeAIResponsePair(prompt, this.messages()[this.messages().length - 1].id);
    this.messages.update(messages => ([...messages, ...pair]));

    try {
      const { inlineData, base64, text }
        = await this.therapyService.editImage(prompt, this.lastEditedImage());
      this.messages.update(messages => {
        return messages.map(message => message.id !== aiMessageId  ?
          message : makeSuccessMessage(message, base64, text)
        );
      });

      this.lastEditedImage.set(inlineData);
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

   toggleConversation() {
      const currentEditing = this.isEditing();
      // not editing to editing
      if (!currentEditing) {
        this.therapyService.startEdit();
      } else {
        // editing to not editing
        this.therapyService.endEdit();
        this.messages.set([]);
      }
      this.isEditing.update((prev) => !prev);
  }

  handleDownloadImage(event: { base64: string, filename: string }) {
    this.genMediaService.downloadImage(event.filename, event.base64);
  }
}
