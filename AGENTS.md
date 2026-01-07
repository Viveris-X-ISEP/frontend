# Instructions for Coding Agents

## Workflow

- **Atomic Git Commits**: Perform atomic git commits following this format:

    ```bash
    git commit -m "<type>(operational scope): <title>.

    <bullet point>
    <bullet point>
    .
    .
    .

    Branch: <local branch name>"
    ```

- **Pre-commit Checks**: Before committing, ensure the following checks are performed:
    - **Formatting**: Format the code using `biome` by running `bun run format`.
    - **Linting**: Check for linting errors using `eslint` by running `bun run lint`.
    - **Testing**: Run tests to ensure functionality.
    - **Git status check**: Run git status to logically organise files in atomic git commits.

## API Calls

- **HTTP Client**: All API calls are made using **axios**.
- **API Client Location**: `src/main/typescript/shared/api/client.ts`
- **Service Pattern**: API calls should be encapsulated in service files (e.g., `auth.service.ts`, `survey.service.ts`).
- **Type Safety**: All request and response payloads must have TypeScript interfaces defined in the feature's `types/` folder.
