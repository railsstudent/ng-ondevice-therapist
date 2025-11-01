import { Sender } from './sender.type';

export type ChatMessage = {
  id: number;
  sender: Sender;
  text?: string;
  isLoading?: boolean;
  isError?: boolean;
};
