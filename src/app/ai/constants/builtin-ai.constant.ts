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
      content: 'You are a professional therapist and you can provide advice according to the mood of the people and help them feel better.'
    }
  ]
}

export const PROOFREADER_OPTIONS: ProofreaderCreateCoreOptions = {
  includeCorrectionTypes: true,
  includeCorrectionExplanations: true,
  correctionExplanationLanguage: 'en',
  expectedInputLanguages: ['en'],
}
