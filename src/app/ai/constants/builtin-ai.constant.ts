export const PROMPT_CREATE_OPTIONS: LanguageModelCreateCoreOptions = {
  expectedInputs: [
    {
      type: 'text',
      languages: ['en']
    },
    {
      type: 'image'
    },
    {
      type: 'audio'
    }
  ],
  expectedOutputs: [
    {
      type: 'text',
      languages: ['en']
    }
  ]
}

export const PROMPT_OPTIONS: LanguageModelCreateOptions = {
  ...PROMPT_CREATE_OPTIONS,
  initialPrompts: [
    {
      role: 'system',
      content: 'You are a professional therapist and you can provide advice to the problem of the patients and help them feel better at the end of the session.'
    },
    {
      role: 'assistant',
      content: 'Do you have any problem to discuss today?'
    }
  ]
}

export const PROOFREADER_OPTIONS: ProofreaderCreateCoreOptions = {
  includeCorrectionTypes: true,
  includeCorrectionExplanations: true,
  correctionExplanationLanguage: 'en',
  expectedInputLanguages: ['en'],
}

export const SUMMARIZER_CREATE_OPTIONS: SummarizerCreateCoreOptions = {
  type: 'tldr',
  format: 'plain-text',
  length: 'short',
  expectedInputLanguages: ['en'],
  expectedContextLanguages: ['en'],
  outputLanguage: 'en',
}

export const SUMMARIZER_OPTIONS: SummarizerCreateOptions = {
  ...SUMMARIZER_CREATE_OPTIONS,
  sharedContext: 'Summarize the conversation of a therapy session.',
}
