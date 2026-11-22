# Services

Service adapters isolate external integrations from mission and simulation logic.
They return data and errors; they do not directly modify spacecraft state or decide
whether a mission has been completed.

## C++ execution: `cpp-execution.js`

`executeCpp()` sends student C++ source code to a Judge0-compatible execution API.
It accepts:

- `sourceCode`: the student's C++ source code.
- `inputSnapshot` (optional): a JSON-serializable object encoded and passed to the
  program through standard input (`stdin`). The C++ program is responsible for
  reading and interpreting that input.

It returns a normalized object containing:

- `ok`: true only when Judge0 reports Accepted and the process exits with code 0.
- `status` / `statusId`: execution-provider status.
- `stdout`: standard output from the program.
- `stderr`: runtime error output.
- `compileOutput`: compiler diagnostics.
- `exitCode`, `time`, and `memory`: execution details when supplied by the provider.

Configuration:

- `JUDGE0_API_URL`: Judge0-compatible API base URL. Defaults to `https://ce.judge0.com`.
- `JUDGE0_API_KEY`: optional API authentication token.
- `JUDGE0_LANGUAGE_ID`: optional Judge0 language ID. Defaults to `54` (C++ GCC 9.2.0
  in the standard Judge0 CE language list); verify this against the selected provider.

The function also accepts optional per-call settings for `apiUrl`, `apiKey`,
`languageId`, `cpuTimeLimit`, `wallTimeLimit`, and `memoryLimit`.

## C++ output: `cpp-output.js`

`parseCppJsonOutput(stdout)` is a small helper for a proposed JSON output protocol.
It parses one JSON object from stdout and rejects empty output, invalid JSON, arrays,
and primitive values.

This helper does not validate which spacecraft commands are allowed. The team must
agree on the exact input/output contract with the simulation owner before connecting
student output to spacecraft state. Do not apply parsed student output directly to
simulation state without validation.

## Important boundaries and deployment notes

- These modules must run in a trusted server-side environment, not in browser code.
- Keep API credentials in server-side environment variables; never expose them to the
  frontend or commit them to Git.
- The adapter's tests mock the provider. They verify request construction and result
  handling, but do not prove that the live provider is available or securely sandboxed.
- Before production use, verify provider authentication, language ID/compiler version,
  execution limits, timeout behavior, rate limits, and sandbox isolation.
- The adapter does not decide mission success or mutate spacecraft state.
