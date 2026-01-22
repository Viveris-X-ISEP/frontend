# Instructions for Coding Agents

## Workflow

- **Atomic Git Commits**: Perform atomic git commits following this format:

    ```bash
    git commit -m "<type>(<operational scope>): <title>.

    <bullet point>
    <bullet point>
    .
    .
    .

    Author: Joaquim Kéloglanian
    Branch: <local branch name>"
    ```

- **Pre-commit Checks**: Before committing, ensure the following checks are performed:
    - **Formatting & Linting & Organising imports**: Format and Lint code and organise imports using by running `bun biome check`. Fix errors automatically using `bun biome check --fix` and manually address the remaining until there are no more errors.
    - **Testing**: Run tests to ensure functionality.
    - **Git status check**: Run git status to logically organise files in atomic git commits.

## API Calls

- **HTTP Client**: All API calls are made using **axios**.
- **API Client Location**: `src/main/typescript/shared/api/client.ts`
- **Service Pattern**: API calls should be encapsulated in service files (e.g., `auth.service.ts`, `survey.service.ts`).
- **Type Safety**: All request and response payloads must have TypeScript interfaces defined in the feature's `types/` folder.
