Run the complete quality check workflow and create a commit.

This command will:
1. Run `pnpm lint` to check for linting errors
2. Run `pnpm format` to apply code formatting
3. Run `pnpm check` to run additional checks
4. Run `pnpm build` to verify the build passes
5. Create a git commit with the provided message

Only proceeds with commit if all quality checks pass successfully.

Arguments: $ARGUMENTS (commit message)