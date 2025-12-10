# Feature: Footprint Quizz Implementation Plan

## General Instructions
Refer to [AGENTS.md](../../AGENTS.md) for general instructions regarding the repository, including git workflow and pre-commit checks.

## Implementation ToDo List

- [ ] **Implement API Calls**
    - Location: `src/main/typescript/features/survey/services/`
    - Reference: The API endpoints for the quizz are found in: `C:\Users\joaqu\Documents\School\ISEP\A3\Projet_de_fin_parcours\Projet Viveris\projet-industriel-back\src\main\java\com\spring\ProjetIndustrielBack\controller\UserEmissionsController.java`

- [ ] **Test API Calls**
    - Verify that the implemented service methods correctly communicate with the backend.

- [ ] **Create API Types**
    - Location: `src/main/typescript/features/survey/types/`
    - Create TypeScript interfaces/types based on the response from the API test calls.

- [ ] **Implement Hooks**
    - Location: `src/main/typescript/features/survey/hooks/`
    - Create custom hooks to manage the quizz state and API interactions.

- [ ] **Implement Components and Screens**
    - Follow the Figma mockup (refer to provided images).
    - Use the app theme located in `src/main/typescript/shared/theme/`.
    - **Constraint**: No magic numbers. Use theme variables for spacing, font sizes, colors, etc.

- [ ] **Follow Auth Feature Implementation Style**
    - Reference `src/main/typescript/features/auth/` for code style, folder structure, and patterns (e.g., Service-Hook-Component pattern).
