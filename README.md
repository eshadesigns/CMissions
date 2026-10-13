# CMissions

CMissions is a planned browser-based educational platform teaching C++ programming and aerospace systems thinking through spacecraft debugging missions. The semester goal is 10 levels, including one polished interactive mission.

The repository is currently at the foundation stage. It contains JavaScript mission configuration, an independent preliminary spacecraft state model, tests, and architecture documentation. No frontend or visual design is implemented. The Design Lead/Product Owner and design team own the Figma design direction, which is not finalized and is subject to change.

## Setup and tests

Install Node.js 22 or newer (npm included), Git, and optionally VS Code. No global npm packages are required.

```sh
git clone https://github.com/eshadesigns/CMissions.git
cd CMissions
npm install
npm test
```

From the existing outer `CMissions-local` workspace, enter `CMissions` first. There is no application startup command, HTML entry point, or development server at this stage.

JavaScript is the primary application language. `package.json` enables ES modules and Node's built-in test runner; there are no external dependencies. Node is used for testing the independent logic, not as a selected application backend. `npm install` maintains the lockfile and supports future approved local dependencies.

## Structure

```text
CMissions/
├── .gitignore
├── README.md
├── package.json
├── package-lock.json
├── docs/
│   ├── architecture.md
│   ├── setup.md
│   └── contributing.md
├── src/
│   ├── missions/
│   │   ├── README.md
│   │   └── level1/
│   │       ├── README.md
│   │       └── config.js
│   ├── simulation/
│   │   ├── README.md
│   │   └── spacecraft-state.js
│   ├── services/
│   │   └── README.md
│   └── utils/
│       └── README.md
└── tests/
    ├── README.md
    └── foundation.test.js
```

See [setup](docs/setup.md), [architecture](docs/architecture.md), and [contributing](docs/contributing.md).

## Current scope and future decisions

Implemented: Level 1: Power Management descriptive configuration and independent spacecraft state initialization, with tests for configuration, essential/non-essential systems, configurable defaults, and independent state copies. Voltage values are illustrative teaching values, not engineering specifications. All loads initially remain on; initialization does not solve the mission.

Unimplemented: frontend, simulation behavior and physics, C++ editor/execution, mission validation, learning support, 3D rendering, backend, authentication, and progress persistence. Directory READMEs describe planned responsibilities rather than implemented integrations. No environment variables are needed, so there is no `.env.example`.

Subsystem owners are expected to research and justify their technology choices with the team. Frontend framework/tooling, editor, sandboxed C++ execution, backend/authentication/storage, rendering, simulation rules, and validation remain undecided. React, Firebase, Three.js, and compiler tools have not been selected.
