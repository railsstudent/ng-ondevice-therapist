import { ChatMessage } from '../types/chat-message.type';

export function makeErrorMessage(oldMessage: ChatMessage, errorMessage: string): ChatMessage {
  return {
    ...oldMessage,
    isLoading: false,
    isError: true,
    text: errorMessage,
  }
}

export function makeSuccessMessage(oldMessage: ChatMessage, text: string | undefined): ChatMessage {
  return {
    ...oldMessage,
    isLoading: false,
    isError: false,
    text: text || 'New image generated based on your edit request.',
  }
}

export function makeAIResponsePair(prompt: string, lastMessageId: number) {
    const aiMessageId = lastMessageId + 2;

    return {
      pair: [
        { id: lastMessageId + 1, sender: 'User', text: prompt },
        { id: aiMessageId, sender: 'AI', isLoading: true }
      ] as ChatMessage[],
      aiMessageId
    }
}
