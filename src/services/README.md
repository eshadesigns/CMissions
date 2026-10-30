// Changed by Sydney

# Services

Service adapters isolate external integrations from mission and simulation
logic.

## C++ execution

`cpp-execution.js` provides `executeCpp()`, an adapter for a
Judge0-compatible C++ execution API.

It accepts C++ source code and an optional mission input snapshot, then
returns normalized execution status, standard output, errors, and resource
usage.

Configuration:
- `JUDGE0_API_URL`: execution API base URL (optional).
- `JUDGE0_API_KEY`: optional API authentication token.

The adapter does not mutate spacecraft state or determine mission success.
Execution output must be validated before it can affect the simulation.

Tests use mocked API responses and do not require external connectivity.

Before production use, verify provider authentication, execution limits,
timeout behavior, and sandbox isolation.


<!-- # Services

Future authentication, progress persistence, API access, and sandboxed C++ execution adapters belong here. No services are implemented or connected. Keep provider details behind adapters returning data and errors; consult `docs/architecture.md` before defining integration contracts. -->