Create a new pull request from the current branch.

This command will:
1. Check git status to understand current changes
2. Check if branch needs to be pushed to remote
3. Push branch to remote with upstream tracking if needed
4. Create a pull request with title and description
5. Return the PR URL for easy access

The PR will include a comprehensive summary of changes and a test plan.

Arguments: $ARGUMENTS (optional: PR title, if not provided will generate from branch name and commits)