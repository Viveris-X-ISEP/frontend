# Feature: Footprint Quizz Implementation Plan

## General Instructions

Refer to [AGENTS.md](../../AGENTS.md) for general instructions regarding the repository, including git workflow and pre-commit checks.

---

## Implementation Status

- [x] **1. Implement API Calls** - `survey.service.ts`
- [x] **2. Test API Calls** - `survey.service.test.ts` (22 tests)
- [x] **3. Create API Types** - `types/index.ts` (matches backend DTOs)
- [x] **4. Implement Hooks** - `useSurvey.ts`, `useSubmitSurvey.ts`, `useSurveyStatus.ts`
- [x] **5. Implement Components** - Survey screens and answer options
- [x] **6. Update Home Screen** - Shows survey prompt when not completed
- [x] **7. Add All Survey Questions** - 19 questions matching backend requirements

---

## FootprintQuizzDto Data Fields

The backend requires the following data structure for calculating carbon emissions. **Total: 19 input fields across 4 categories**.

### 1. TRANSPORT Category (9 fields)

#### Car
| Field | Type | Description | Survey Question |
|-------|------|-------------|-----------------|
| `fuelType` | FuelType enum | Type of fuel | "Quel type de carburant utilise votre voiture ?" |
| `kilometersPerYear` | int | Annual km driven | "Combien de kilomètres parcourez-vous en voiture par an ?" |
| `passengers` | int | Average passengers | "En moyenne, combien de passagers voyagent avec vous ?" |

**FuelType enum**: `ELECTRIC`, `GASOLINE`, `DIESEL`, `HYBRID`

#### PublicTransport
| Field | Type | Description | Survey Question |
|-------|------|-------------|-----------------|
| `type` | PublicTransportType enum | Primary type | "Quel type de transport en commun utilisez-vous principalement ?" |
| `useFrequency` | LowMediumHigh enum | Frequency | "À quelle fréquence utilisez-vous les transports en commun ?" |

**PublicTransportType enum**: `BUS`, `TRAMWAY`, `METRO`, `TRAIN`
**LowMediumHigh enum**: `LOW`, `MEDIUM`, `HIGH`

#### AirTransport
| Field | Type | Description | Survey Question |
|-------|------|-------------|-----------------|
| `shortFlightsFrequencyPerYear` | int | Flights <3h | "Combien de vols courts (<3h) prenez-vous par an ?" |
| `mediumFlightsFrequencyPerYear` | int | Flights 3-6h | "Combien de vols moyens (3-6h) prenez-vous par an ?" |
| `longFlightsFrequencyPerYear` | int | Flights >6h | "Combien de vols longs (>6h) prenez-vous par an ?" |

#### Other
| Field | Type | Description | Survey Question |
|-------|------|-------------|-----------------|
| `bikeUsePerWeek` | int | Times per week | "Combien de fois par semaine utilisez-vous le vélo ?" |

---

### 2. FOOD Category (4 fields)

| Field | Type | Description | Survey Question |
|-------|------|-------------|-----------------|
| `redMeatConsumptionPerWeek` | int | Meals/week | "Combien de repas à base de viande rouge consommez-vous par semaine ?" |
| `whiteMeatConsumptionPerWeek` | int | Meals/week | "Combien de repas à base de volaille consommez-vous par semaine ?" |
| `fishConsumptionPerWeek` | int | Meals/week | "Combien de repas à base de poisson consommez-vous par semaine ?" |
| `dairyConsumptionPerWeek` | int | Portions/week | "Combien de portions de produits laitiers consommez-vous par semaine ?" |

---

### 3. HOUSING Category (3 fields)

| Field | Type | Description | Survey Question |
|-------|------|-------------|-----------------|
| `housingType` | HousingType enum | Residence type | "Quel est votre type de logement ?" |
| `surfaceArea` | int | m² | "Quelle est la superficie de votre logement ?" |
| `heatingEnergySource` | EnergySource enum | Main heating | "Quelle est votre source d'énergie principale pour le chauffage ?" |

**HousingType enum**: `APARTMENT`, `HOUSE`, `COLOCATION`, `VILLA`
**EnergySource enum**: `GAZ`, `FUEL_OIL`, `ELECTRICITY`, `HEAT_PUMP`, `WOOD`, `CHIPS`, `HEAT_NETWORK`

---

### 4. DIGITAL Category (3 fields)

| Field | Type | Description | Survey Question |
|-------|------|-------------|-----------------|
| `hoursOfStreamingPerWeek` | int | Hours/week | "Combien d'heures de streaming vidéo regardez-vous par semaine ?" |
| `chargingFrequencyPerDay` | int | Times/day | "Combien de fois par jour rechargez-vous vos appareils électroniques ?" |
| `numberOfDevicesOwned` | int | Total devices | "Combien d'appareils électroniques possédez-vous ?" |

---

## Example API Payload

```json
{
  "userId": 1,
  "food": {
    "redMeatConsumptionPerWeek": 3,
    "whiteMeatConsumptionPerWeek": 4,
    "fishConsumptionPerWeek": 2,
    "dairyConsumptionPerWeek": 7
  },
  "transport": {
    "car": {
      "fuelType": "GASOLINE",
      "kilometersPerYear": 15000,
      "passengers": 1
    },
    "publicTransport": {
      "type": "METRO",
      "useFrequency": "HIGH"
    },
    "airTransport": {
      "shortFlightsFrequencyPerYear": 2,
      "mediumFlightsFrequencyPerYear": 1,
      "longFlightsFrequencyPerYear": 0
    },
    "bikeUsePerWeek": 3
  },
  "housing": {
    "housingType": "APARTMENT",
    "surfaceArea": 50,
    "heatingEnergySource": "ELECTRICITY"
  },
  "digital": {
    "digitalConsumption": {
      "hoursOfStreamingPerWeek": 10,
      "chargingFrequencyPerDay": 2
    },
    "numberOfDevicesOwned": 4
  }
}
```

---

## Survey Flow

### Screen 1: Home Screen (Survey Not Completed)
- **When**: User first logs in and has not completed the survey.
- **Display**:
    - User profile card (avatar, username, level, points).
    - "Pas de données !" message.
    - "Calculons votre empreinte carbone." subtitle.
    - **"Répondre au questionnaire"** button.
- **Missions Tab**: Inaccessible/disabled.

### Screen 2: Survey Introduction Screen
- **Route**: `/survey`
- **Display**:
    - Close button (X) in top-right corner.
    - Title: "Il est temps pour un nouveau départ !"
    - Subtitle explaining the purpose of the survey.
    - Large Earth/globe illustration.
    - **"Démarrer le questionnaire"** button.
- **Action**: Clicking "Démarrer" navigates to the questions screen.

### Screen 3: Survey Questions Screen (19 questions)
- **Navigation**: Expo Stack layout for question navigation.
- **Display**:
    - Close button (X) in top-right corner.
    - Progress indicator: "Question X sur 19" with progress bar.
    - Question text (bold, large).
    - Answer options as radio-button cards (single select).
    - **"Retour"** button (secondary, left).
    - **"Suivant"** button (primary, right).
- **Flow**:
    - User selects one answer per question.
    - "Retour" goes to previous question (disabled on first question).
    - "Suivant" proceeds to next question (disabled until answer selected).
    - On last question, "Suivant" becomes "Terminer" and submits the survey.

### Screen 4: Post-Survey
- **After submission**:
    - Survey completion status is saved via backend.
    - User is redirected to the Home screen.
    - Missions tab becomes accessible.

---

## Survey Completion Tracking

Survey completion is tracked by checking if the user has emission data:
- **Endpoint**: `GET /emissions/user/:userId`
- **Logic**: If endpoint returns data with `totalEmissions > 0`, survey is complete.
- **Hook**: `useSurveyStatus()` handles this check.

---

## File Structure

```
src/main/typescript/features/survey/
├── index.tsx                      # Exports
├── components/
│   ├── survey-intro.screen.tsx    # Introduction screen
│   ├── survey-questions.screen.tsx # Questions screen
│   └── answer-option.component.tsx # Reusable answer card
├── hooks/
│   ├── index.ts
│   ├── useSurvey.ts              # Survey state (19 questions)
│   ├── useSubmitSurvey.ts        # API submission
│   └── useSurveyStatus.ts        # Check completion status
├── services/
│   ├── index.ts
│   └── survey.service.ts         # API calls
└── types/
    └── index.ts                  # TypeScript interfaces
```

---

## Theme Usage Reference

Always use theme variables instead of magic numbers:

```typescript
// ✅ Correct
const styles = createStyles(theme);
// ...
container: {
  padding: theme.spacing.lg,
  backgroundColor: theme.colors.background,
}

// ❌ Incorrect
container: {
  padding: 24,
  backgroundColor: '#FFFFFF',
}
```

### Available Theme Variables:
- **Colors**: `theme.colors.primary`, `theme.colors.text`, `theme.colors.background`, `theme.colors.inputBackground`, `theme.colors.outline`, `theme.colors.error`
- **Spacing**: `theme.spacing.xs` (4), `theme.spacing.sm` (8), `theme.spacing.md` (16), `theme.spacing.lg` (24), `theme.spacing.xl` (32)
- **Font Sizes**: `theme.fontSizes.xs` (12), `theme.fontSizes.sm` (14), `theme.fontSizes.md` (16), `theme.fontSizes.lg` (18), `theme.fontSizes.xl` (24), `theme.fontSizes.xxl` (28)
- **Border Radius**: `theme.borderRadius.sm` (8), `theme.borderRadius.md` (16), `theme.borderRadius.lg` (24), `theme.borderRadius.full` (9999)
