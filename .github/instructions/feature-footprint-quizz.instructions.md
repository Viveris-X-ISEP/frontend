# Feature: Footprint Quizz Implementation Plan

## General Instructions

Refer to [AGENTS.md](../../AGENTS.md) for general instructions regarding the repository, including git workflow and pre-commit checks.

---

## Implementation ToDo List

- [ ] **1. Implement API Calls**
    - **Location**: `src/main/typescript/features/survey/services/`
    - **Reference**: The API endpoints for the quizz are found in:  
      `C:\Users\joaqu\Documents\School\ISEP\A3\Projet_de_fin_parcours\Projet Viveris\projet-industriel-back\src\main\java\com\spring\ProjetIndustrielBack\controller\UserEmissionsController.java`
    - Create `survey.service.ts` following the pattern in `auth.service.ts`
    - Export via `index.ts`

- [ ] **2. Test API Calls**
    - Verify that the implemented service methods correctly communicate with the backend.
    - Test with actual backend responses to validate data flow.

- [ ] **3. Create API Types**
    - **Location**: `src/main/typescript/features/survey/types/`
    - Create TypeScript interfaces/types based on the backend DTOs and API responses.
    - Separate request payloads from response payloads (follow `auth/types/index.ts` pattern).
    - Export via `index.ts`

- [ ] **4. Implement Hooks**
    - **Location**: `src/main/typescript/features/survey/hooks/`
    - Create custom hooks to manage the quizz state and API interactions.
    - Follow the pattern in `auth/hooks/` (e.g., `useSignIn.ts`).
    - Suggested hooks:
        - `useSurvey.ts` – Manages survey state, current question, and answers.
        - `useSubmitSurvey.ts` – Handles API submission of survey results.
    - Export via `index.ts`

- [ ] **5. Implement Components and Screens**
    - Follow the Figma mockup (refer to provided images).
    - **Location**: `src/main/typescript/features/survey/components/`
    - Use the app theme located in `src/main/typescript/shared/theme/`.
    - **Constraint**: No magic numbers. Use theme variables for spacing, font sizes, colors, etc.
    - Use dynamic styles with `createStyles(theme)` pattern (see `sign-in.screen.tsx`).

- [ ] **6. Follow Auth Feature Implementation Style**
    - Reference `src/main/typescript/features/auth/` for code style, folder structure, and patterns.
    - Pattern: **Service → Hook → Component**
    - Services handle API calls, hooks manage state/logic, components handle UI.

- [ ] **7. Update Home Screen**
    - Modify `src/main/typescript/features/home/components/index.screen.tsx` to:
        - Display "Répondre au questionnaire" button when survey not completed.
        - Navigate to survey on button press.
    - *(Full home screen update deferred for now)*

- [ ] **8. Conditionally Disable Missions Tab**
    - Modify `src/main/typescript/app/(tabs)/_layout.tsx` to disable "missions" tab when survey is not completed.
    - TODO: Determine how survey completion status is tracked (see notes below).

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
- **Route**: `/questionnaire` or `/survey`
- **Display**:
    - Close button (X) in top-right corner.
    - Title: "Il est temps pour un nouveau départ !"
    - Subtitle explaining the purpose of the survey.
    - Large Earth/globe illustration.
    - **"Démarrer le questionnaire"** button.
- **Action**: Clicking "Démarrer" navigates to the questions screen.

### Screen 3: Survey Questions Screen
- **Navigation**: Expo Stack layout for question navigation.
- **Display**:
    - Close button (X) in top-right corner.
    - Progress indicator: "Question X sur Y" with progress bar.
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
    - Survey completion status is saved.
    - User is redirected to the updated Home screen (deferred).
    - Missions tab becomes accessible.

---

## Survey Completion Tracking

> **TODO**: Investigate where the app tracks whether the user has completed the survey.

### Potential Locations:
1. **Backend User Profile**: The backend may include a `hasCompletedSurvey` or `emissionsCalculated` field in the user profile or auth response.
2. **Dedicated Endpoint**: There may be a `GET /user/emissions` or similar endpoint that returns `null`/empty if no survey has been submitted.
3. **Local State**: If not tracked by backend, consider adding a `hasSurveyCompleted` field to `auth-store.ts` or creating a dedicated `survey-store.ts`.

### Recommended Actions:
- [ ] Check `UserEmissionsController.java` for a "get emissions" endpoint.
- [ ] Check if the auth response includes survey/emissions status.
- [ ] If no backend tracking exists, add TODO comments in code and create a local store solution.

---

## File Structure (Target)

```
src/main/typescript/features/survey/
├── index.tsx                  # Exports
├── components/
│   ├── survey-intro.screen.tsx    # Introduction screen
│   ├── survey-question.screen.tsx # Question screen
│   └── answer-option.component.tsx # Reusable answer card
├── hooks/
│   ├── index.ts
│   ├── useSurvey.ts           # Survey state management
│   └── useSubmitSurvey.ts     # API submission hook
├── services/
│   ├── index.ts
│   └── survey.service.ts      # API calls
└── types/
    └── index.ts               # TypeScript interfaces
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
