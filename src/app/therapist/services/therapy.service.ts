import { PROMPT_CREATE_OPTIONS, PROMPT_OPTIONS, PROOFREADER_OPTIONS, SUMMARIZER_CREATE_OPTIONS, SUMMARIZER_OPTIONS } from '@/ai/constants/builtin-ai.constant';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TherapyService {
  onDeviceChatSession = signal<LanguageModel | undefined>(undefined);
  onDeviceProofreader = signal<Proofreader | undefined>(undefined);
  onDeviceSummarizer = signal<Summarizer | undefined>(undefined);

  async testChromeBuiltInAI() {
    const promptAvailability = await LanguageModel.availability(PROMPT_CREATE_OPTIONS);
    const proofreadAvailability = await Proofreader.availability(PROOFREADER_OPTIONS);
    const summarizerAvailability = await Summarizer.availability(SUMMARIZER_CREATE_OPTIONS);

    return promptAvailability !== 'unavailable' &&
      summarizerAvailability !== 'unavailable' &&
      proofreadAvailability !== 'unavailable';
  }

  async createSession() {
    const newSession = await LanguageModel.create(PROMPT_OPTIONS);
    this.onDeviceChatSession.set(newSession );

    const proofreader = await Proofreader.create(PROOFREADER_OPTIONS);
    this.onDeviceProofreader.set(proofreader);

    const summarizer = await Summarizer.create(SUMMARIZER_OPTIONS);
    this.onDeviceSummarizer.set(summarizer);
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

  async generateSummaries(messages: (string | undefined)[]) {
    const summarizer = this.onDeviceSummarizer();

    if (!summarizer) {
      return '';
    }

    const inputQuota = summarizer.inputQuota;

    const undefinedMessages: string[] = [];
    for (const message of messages) {
      if (typeof message !== 'undefined' && message !== '') {
        const inputUsage = await summarizer.measureInputUsage(message);
        if (inputUsage <= inputQuota) {
          undefinedMessages.push(message);
        }
      }
    }

    if (undefinedMessages.length === 0) {
      return '';
    }

    const summarizePromises = undefinedMessages.map((message) => summarizer.summarize(message));
    const results = await Promise.allSettled(summarizePromises);

    return results
      .filter((result) => result.status === 'fulfilled')
      .map((result) => result.value)
      .join('');
  }

  destroySession() {
    try {
      this.onDeviceChatSession()?.destroy();
      this.onDeviceProofreader()?.destroy();
      this.onDeviceSummarizer()?.destroy();
    } finally {
      this.onDeviceChatSession.set(undefined);
      this.onDeviceProofreader.set(undefined);
      this.onDeviceChatSession.set(undefined);
    }
  }
}
