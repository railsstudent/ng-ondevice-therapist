import { PROMPT_OPTIONS, PROOFREADER_OPTIONS } from '@/ai/constants/builtin-ai.constant';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TherapyService {
  onDeviceChatSession = signal<LanguageModel | undefined>(undefined);

  async testChromeBuiltInAI() {
    const promptAvailability = await LanguageModel.availability(PROMPT_OPTIONS);
    const proofreadAvailability = await Proofreader.availability(PROOFREADER_OPTIONS);

    return promptAvailability !== 'unavailable' && proofreadAvailability !== 'unavailable';
  }

  async createSession() {
    const newSession = await LanguageModel.create(PROMPT_OPTIONS);
    this.onDeviceChatSession.set(newSession );
  }

  async promptText(userPrompt: string) {
    const message = await this.onDeviceChatSession()?.prompt(userPrompt) || '';
    return message;
  }

  destroySession() {
    this.onDeviceChatSession()?.destroy();
    this.onDeviceChatSession.set(undefined);
  }
}
