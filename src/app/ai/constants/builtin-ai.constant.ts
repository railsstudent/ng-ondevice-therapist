export const PROMPT_OPTIONS: LanguageModelCreateCoreOptions = {
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

export const PROOFREADER_OPTIONS: ProofreaderCreateCoreOptions = {
  includeCorrectionTypes: true,
  includeCorrectionExplanations: true,
  correctionExplanationLanguage: 'en',
  expectedInputLanguages: ['en'],
}
