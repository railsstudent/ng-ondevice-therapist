import { PROMPT_CREATE_OPTIONS, PROMPT_OPTIONS, PROOFREADER_OPTIONS } from '@/ai/constants/builtin-ai.constant';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TherapyService {
  onDeviceChatSession = signal<LanguageModel | undefined>(undefined);
  onDeviceProofreader = signal<Proofreader | undefined>(undefined);

  async testChromeBuiltInAI() {
    const promptAvailability = await LanguageModel.availability(PROMPT_CREATE_OPTIONS);
    const proofreadAvailability = await Proofreader.availability(PROOFREADER_OPTIONS);

    return promptAvailability !== 'unavailable' && proofreadAvailability !== 'unavailable';
  }

  async createSession() {
    const newSession = await LanguageModel.create(PROMPT_OPTIONS);
    this.onDeviceChatSession.set(newSession );

    const proofreader = await Proofreader.create(PROOFREADER_OPTIONS);
    this.onDeviceProofreader.set(proofreader);
  }

  async proofreadPrompt(userPrompt: string) {
    const proofReaderResult = await this.onDeviceProofreader()?.proofread(userPrompt);
    console.log('proofReaderResult', proofReaderResult);

    return proofReaderResult?.correctedInput || userPrompt;
  }

  async promptText(correctedUserPrompt: string) {
    const message = await this.onDeviceChatSession()?.prompt(correctedUserPrompt) || '';
    return message;
  }

  destroySession() {
    try {
      this.onDeviceChatSession()?.destroy();
      this.onDeviceProofreader()?.destroy();
    } finally {
      this.onDeviceChatSession.set(undefined);
      this.onDeviceProofreader.set(undefined);
    }
  }
}
