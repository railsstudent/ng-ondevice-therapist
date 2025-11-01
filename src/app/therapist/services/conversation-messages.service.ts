import { Injectable } from '@angular/core';
import { Base64InlineData } from '../types/base64-inline-data.type';
import { ChatMessage, PreviousMessagesState } from '../types/chat-message.type';

@Injectable({
  providedIn: 'root'
})
export class ConversationMessagesService {
  computeInitialMessage(source: Base64InlineData, previous: PreviousMessagesState) {
      if (previous?.value) {
        return  previous.value;
      }

      const {
        base64,
        text = 'Here is the original image you uploaded. How would you like to edit it?'
      } = source;

      if (!base64) {
        return previous?.value ?? undefined;
      }

      return {
        id: 1,
        sender: 'AI',
        text,
        base64,
        isError: false,
      } as ChatMessage;
  }
}
