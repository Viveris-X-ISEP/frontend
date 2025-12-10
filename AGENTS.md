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

    Refs: #<local branch name>"
    ```

- **Pre-commit Checks**: Before committing, ensure the following checks are performed:
    - **Linting**: Check for linting errors using `eslint`.
    - **Formatting**: Format the code using `prettier`.
    - **Testing**: Run tests to ensure functionality.
