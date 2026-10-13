# Team setup

1. Install Git and Node.js 22 or newer, then install VS Code if desired. Verify with `git --version`, `node --version`, and `npm --version`.
2. Obtain repository access on GitHub. Use VS Code's **Git: Clone** command with `https://github.com/eshadesigns/CMissions.git`, then open the cloned folder. Alternatively:

   ```sh
   git clone https://github.com/eshadesigns/CMissions.git
   cd CMissions
   ```

3. Open **Terminal → New Terminal** in VS Code. Ensure the folder contains `package.json`; in the provided local workspace this is the nested `CMissions` folder.
4. Run `npm install`. There are currently no external dependencies.
5. Run `npm test` to verify the mission configuration and preliminary state initialization.

There is no frontend to launch and no development server or `npm run dev` command. No build, account, database, environment file, or API key is required. Node runs tests only; it does not establish a backend technology choice. If `npm` is missing, restart VS Code after installing Node. If `package.json` is missing, check the terminal's current folder.

Explore `src/missions/level1/config.js` and `src/simulation/spacecraft-state.js` for the implemented logic. Read [architecture](architecture.md) before developing a subsystem.

GitHub changes become available to teammates after commits are pushed and merged. Follow [contributing](contributing.md) for the collaboration workflow.
