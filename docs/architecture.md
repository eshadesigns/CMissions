# Architecture and integration boundaries

The repository is at the foundation stage. JavaScript is the primary application language, with ES modules for independent mission data and state initialization. There is no frontend, HTML entry point, development server, backend, or application framework. Node's built-in test runner verifies the implemented logic.

Mission configuration (`missions/level1/config.js`) owns ID, descriptions, learning concepts, subsystem defaults, illustrative battery settings, and the intended success condition. `simulation/spacecraft-state.js` copies defaults into independent mutable state: `{ batteryVoltage, subsystems }`. Each subsystem has `id`, `name`, `essential`, `poweredOn`, and `operatingState`. Power and operating state are distinct fields; future transition rules must define their relationship. Initialization performs no battery physics or automatic load shedding.

Example imports from a future module located in `src/simulation/`:

```js
import { powerManagementMission } from '../missions/level1/config.js';
import { createInitialSpacecraftState } from './spacecraft-state.js';

const state = createInitialSpacecraftState(powerManagementMission);
// Separate instances do not share subsystem objects with the configuration.
```

## Future contracts to agree as features are developed

| Concern | Responsibility and proposed communication boundary |
| --- | --- |
| Frontend | Render configuration, telemetry snapshots, status, editor, and feedback. Send user actions to simulation/service adapters; keep physics out of DOM code. The frontend owner should establish its directory structure after design and tooling decisions are agreed. |
| Backend | Adapters in `services/` may expose async load/save progress and authentication operations. Return data/errors rather than modifying DOM or spacecraft state. Storage schema and provider remain undecided. |
| Simulation | Consume mission settings, current state, and validated actions. Produce next state, telemetry, and events. Keep time evolution and validation independent of UI and rendering. Rules and physics remain undecided. |
| C++ execution | A service adapter should accept source and a defined input snapshot, returning diagnostics and validated subsystem commands. The simulation applies permitted commands. Sandbox, resource/time limits, compiler, and input/output protocol must be evaluated before execution is added. Never use browser `eval()` or `new Function()`. |
| 3D rendering | Consume read-only state/telemetry and render it; never own mission truth or validate success. Renderer and asset formats remain undecided. |
| Learning support | Consume mission, diagnostics, and validation results; return hints/explanations for the UI. Do not secretly change state or progress. Content and feedback approach remain undecided. |

These are documented boundaries, not implemented APIs. Future validation should report mission outcomes separately from UI display; persistence can save those outcomes once defined. No progress status or persistence system exists yet. Mission validation requirements belong in `missions/`, while generic state transitions belong in `simulation/`.

## Directory responsibilities and tooling

- `missions/`: mission definitions, objectives, learning concepts, and future validation requirements.
- `simulation/`: preliminary spacecraft state, subsystem states, and future telemetry/simulation logic.
- `services/`: future authentication, progress persistence, API, and C++ execution adapters; no integrations exist yet.
- `utils/`: small shared helpers when real consumers need them; none are implemented yet.
- `docs/`: architecture, setup, and contribution guidance.
- `tests/`: tests of implemented mission configuration and state initialization.

`package.json` and the lockfile support ES modules and the built-in test command, with no external dependencies. A development server is unnecessary until browser implementation starts, so the prototype's server and frontend files have been removed. `.env.example` is omitted because no environment variables are used. Production hosting, build tooling, framework, database, editor, renderer, and execution infrastructure remain for team evaluation.
