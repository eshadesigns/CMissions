# Contributing

Use readable JavaScript ES modules. Keep mission data, simulation state, UI, and integration adapters separate.

Start from the repository's default branch (replace `<default-branch>` with the branch shown on GitHub):

```sh
git switch <default-branch>
git pull --ff-only
git switch -c feature/short-description
npm install
npm test
```

Make a focused change. Run tests for affected implemented logic. Update relevant documentation. Stage only intended files:

```sh
git status
git add <changed-file-paths>
git commit -m "Describe the change"
git push -u origin feature/short-description
```

Open a pull request on GitHub describing the problem, resulting behavior, and checks actually run. Ask a teammate to review readability, scope, module boundaries, and correctness. Address feedback before merging. Avoid unrelated rewrites and Git history changes; coordinate changes to shared files. No formatter, linter, or CI service has been selected yet.
