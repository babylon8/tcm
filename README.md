# TCM Self-Diagnosis Webapp (中医体质自诊系统)

A web application to help users self-diagnose health issues through Traditional Chinese Medicine (TCM) principles.

## MVP Features

1. **Constitution Assessment** - 9 TCM constitution types questionnaire
2. **Symptom Checker** - Body map + symptom categorization
3. **Results Dashboard** - Constitution profile + recommendations
4. **Educational Content** - TCM basics library
5. **User Profiles** - Assessment history tracking

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Storage**: Static JSON files
- **State Management**: React Context / Zustand

## Project Structure

```
tcm/
├── data/                    # Static JSON data files
│   ├── constitutions.json   # 9 constitution types
│   ├── symptoms.json        # Symptom categories & items
│   ├── questions.json       # Assessment questions
│   └── recommendations.json # Health recommendations
├── docs/                    # Specification documents
│   ├── SPEC.md              # Full specification
│   ├── DATA_MODELS.md       # Data model documentation
│   └── QUESTIONNAIRE.md     # Questionnaire design
├── src/
│   ├── app/                 # Next.js app router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities & helpers
│   ├── types/               # TypeScript type definitions
│   └── hooks/               # Custom React hooks
└── public/                  # Static assets
```

## Development

```bash
npm install
npm run dev
```

## Documentation

- [Full Specification](./docs/SPEC.md)
- [Data Models](./docs/DATA_MODELS.md)
- [Questionnaire Design](./docs/QUESTIONNAIRE.md)

## Disclaimer

This application is for educational and self-awareness purposes only. It does not provide medical diagnosis. Always consult a licensed TCM practitioner for actual treatment.
