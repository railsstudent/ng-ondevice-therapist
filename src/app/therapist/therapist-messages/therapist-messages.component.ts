import { SpinnerIconComponent } from '@/shared/icons/spinner-icon.component';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatErrorIconComponent } from '../icons/chat-error-icon.component';
import { ChatMessage } from '../types/chat-message.type';
import { Sender } from '../types/sender.type';

@Component({
  selector: 'app-conversation-messages',
  imports: [
    FormsModule,
    SpinnerIconComponent,
    ChatErrorIconComponent,
  ],
  styleUrl: './therapist-messages.component.css',
  templateUrl: './therapist-messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TherapistMessagesComponent {
  messages = input.required<ChatMessage[]>();
  isLoading = input.required<boolean>();

  downloadImage = output<{ base64: string, filename: string }>();

  getItemClasses(sender: Sender): string {
    if (sender === 'User') {
      return 'items-end';
    } else if (sender === 'AI') {
      return 'items-start';
    }

    return '';
  }

  getTextColorClases(sender: Sender): string {
    if (sender === 'User') {
      return 'bg-indigo-600 text-white rounded-br-lg';
    } else if (sender === 'AI') {
       return 'bg-gray-700 text-gray-200 rounded-bl-lg';
    }

    return '';
  }

  getJustifyEndClasses(sender: Sender): string {
    return sender === 'User' ? 'justify-end' : '';
  }
}
