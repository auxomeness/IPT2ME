# IPT2ME

The Simple Grade Management System uses an Express backend, React + Vite frontend, and SQLite database. See [context.md](context.md) for the team assignments and project decisions.

## Requirements

- Node.js 20.19 or newer
- npm 10 or newer

## Check Node before the exam

Open a terminal and check that both commands work:

```bash
node --version
npm --version
```

Use Node.js `20.19.0` or newer and npm `10` or newer. The repository's `.nvmrc` records the minimum tested Node version. If `node` or `npm` is not recognized, or Node is older than `20.19.0`, install or update Node.js from the [official Node.js download page](https://nodejs.org/en/download). Then close and reopen the terminal and run both checks again. npm is installed with Node.js.

Before the timed exam, from this project folder, install dependencies and run the checks once:

```bash
npm ci
npm run lint
npm test
npm run build
```

If those commands pass, the project is ready. During the exam, start both apps with `npm run dev`.

## Get started

Clone the repository and enter the project folder:

```bash
git clone https://github.com/auxomeness/IPT2ME.git
cd IPT2ME
```

Then install dependencies and run both apps:

```bash
npm ci
npm run dev
```

The backend runs at `http://localhost:3000`; the Vite app runs at `http://localhost:5173`. `GET /api/subjects` lists subjects and accepts an optional `search` query parameter.

Environment files are optional for local defaults. To customize settings, copy `backend/.env.example` to `backend/.env` and `frontend/.env.example` to `frontend/.env` (PowerShell: use `Copy-Item backend/.env.example backend/.env` and `Copy-Item frontend/.env.example frontend/.env`).

### If `npm ci` fails

1. Check the installed versions with `node --version` and `npm --version`. Use Node.js 20.19 or newer and npm 10 or newer.
2. If the error says `package.json` and `package-lock.json` are out of sync, do not work around it by switching everyone to `npm install`. On a branch, run `npm install` after an intentional dependency change, review the changes to both package files, and commit them. Then retry `npm ci`.
3. If npm reports a network or registry error, check the internet connection and run `npm ping`, then retry `npm ci`.
4. If the error persists, save the complete error output and share it with the project team before changing the lockfile or clearing npm's cache.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run backend and frontend together with reload / HMR |
| `npm run build` | Check backend syntax and build the frontend |
| `npm run lint` | Run ESLint across both workspaces |
| `npm test` | Run workspace tests; succeeds when no tests have been added yet |

Run a workspace by itself with `npm run dev --workspace backend` or `npm run dev --workspace frontend`.

## Git collaboration workflow

Everyone creates their own working branch from the latest `main`. Do not commit project work directly to `main`.

### Start a task

After cloning, or before starting a new task, update `main` and create a descriptive branch:

```bash
git switch main
git pull --ff-only origin main
git switch -c feature/add-login
```

Right after cloning, `git branch` normally shows only `main`; that is expected. Run `git switch -c feature/add-login` while on `main` to create your local branch and switch to it. Confirm your current branch with:

```bash
git branch --show-current
```

It should print `feature/add-login`. The new branch starts from the current `main`; it does not change `main`. Your branch stays local until you push it with `git push -u origin feature/add-login`.

Use a branch prefix that describes the work:

| Prefix | Use for | Example |
| --- | --- | --- |
| `feature/` | New behavior | `feature/add-login` |
| `fix/` | Bug fixes | `fix/cors-origin` |
| `docs/` | Documentation | `docs/setup-guide` |
| `refactor/` | Code changes without intended behavior changes | `refactor/backend-config` |
| `test/` | Adding or changing tests | `test/login-validation` |
| `chore/` | Maintenance and tooling | `chore/update-dependencies` |

Use lowercase kebab-case, keep names short and specific, and add a ticket number if the team uses one (for example, `feature/123-add-login`).

### Update `main` without losing unfinished work

If you have uncommitted changes on your feature branch and need the latest remote `main`, stash tracked and untracked work first. Replace the example branch with your branch name:

```bash
git status
git stash push -u -m "wip: add login"
git switch main
git pull --ff-only origin main
git switch feature/add-login
git merge main
git stash pop
```

What each command does:

1. `git status` shows your current branch and which files have uncommitted changes.
2. `git stash push -u -m "wip: add login"` saves your unfinished changes temporarily. `-u` includes untracked files, and `-m` adds a label so you can identify the stash.
3. `git switch main` switches to your local `main` branch. Stashing first leaves the working tree clean so the switch can happen safely.
4. `git pull --ff-only origin main` fetches the latest `main` from the remote named `origin` and fast-forwards local `main`. `--ff-only` stops if Git cannot update it without creating a merge commit.
5. `git switch feature/add-login` switches back to your feature branch. Replace this example with your branch name.
6. `git merge main` brings the updated local `main` changes into the feature branch you are currently on.
7. `git stash pop` reapplies your saved unfinished changes to the feature branch and removes that stash entry if it applies successfully.

Resolve any merge or stash conflicts, then run `npm run lint`, `npm test`, and `npm run build`. If `git stash pop` reports conflicts, resolve them and check `git status`; Git keeps the stash entry when applying it fails. You can also commit a small WIP commit on your feature branch instead of stashing when you want the unfinished work saved in Git.

### Commit naming

Use a short Conventional Commit style subject: a lowercase type, a colon, and a concise description. Write the description as an action and omit the final period.

```text
feat: add login route
fix: handle missing request body
docs: explain branch workflow
refactor: separate app configuration
test: cover login validation
chore: update development dependencies
```

Keep each commit focused on one related change. Do not commit `.env` files, credentials, `node_modules/`, or generated build output.

### Open a pull request

Push your branch and open a pull request with `main` as the base branch:

```bash
git push -u origin feature/add-login
```

On the repository host, create a pull request from your branch into `main`. Use a clear title, summarize what changed and why, list the checks you ran, and link the related issue or task. Mark the pull request as a draft while it is still in progress. Before requesting review, run:

```bash
npm run lint
npm test
npm run build
```

Address review feedback on the same branch, push the updates, and wait for the required approvals and checks before merging. Follow the repository's merge settings.

## Code comments

- Explain why a non-obvious decision exists; avoid comments that merely repeat what the code already says.
- Keep comments close to the code they describe, and update or remove them when behavior changes.
- Make TODO comments actionable, such as `// TODO: Reject expired tokens before authorizing the request.`
- Do not leave commented-out code in a pull request; Git history keeps old implementations.
- Add a short JSDoc comment to exported functions only when their purpose, inputs, or side effects are not clear from the code.

## Project structure

```text
IPT2ME/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── controller.js         # HTTP request/response handling
│   │   ├── models/
│   │   │   ├── model.js               # Optional persistence model starting point
│   │   │   └── README.md              # Persistence model notes
│   │   ├── routes/
│   │   │   └── routes.js              # API route definitions
│   │   ├── services/
│   │   │   └── service.js             # Business logic
│   │   ├── validators/
│   │   │   └── validator.js           # Request data validation
│   │   └── server.js        # Configure and start the Express server
│   ├── .env.example         # Backend environment variable template
│   └── package.json         # Backend dependencies and commands
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Root React component; empty starting point
│   │   └── main.jsx         # Mounts the React app in the browser
│   ├── .env.example         # Frontend environment variable template
│   ├── index.html           # HTML document Vite serves
│   ├── package.json         # Frontend dependencies and commands
│   └── vite.config.js       # Vite and React development/build settings
├── .nvmrc                  # Suggested Node.js version
├── context.md              # Grade system scope, team ownership, open decisions
├── eslint.config.js        # Shared JavaScript lint rules
├── package-lock.json       # Locked dependency versions for npm ci
├── package.json            # npm workspaces and shared commands
└── README.md               # Setup and project guide
```

### Backend request flow

When you add an API feature, keep each layer focused:

1. **Route** matches the HTTP method and URL, then applies the validator and controller.
2. **Validator** checks that request parameters and body data have the expected shape.
3. **Controller** reads the request, calls the service, and builds the HTTP response.
4. **Service** implements the feature's business rules. It can call a model when persistence is needed.
5. **Model** defines how application data is stored and retrieved from SQLite.

The starter files contain valid JavaScript modules and short TODO stubs. The empty router is mounted under `/api`, so the Express app is ready for routes but exposes no feature endpoints yet. Add application code directly to these files, then split them into resource-specific files as the project grows. There are no sample business rules or active database connections.

### Frontend purpose

- **`main.jsx`** starts React and attaches the root component to the `root` element in `index.html`.
- **`App.jsx`** is the empty top-level component where the app's screens can be added.
- **`vite.config.js`** configures Vite's React support, development server, and production build.

### Root configuration

- **Root `package.json`** defines the backend and frontend as npm workspaces and provides commands to run, build, lint, and test both together.
- **`package-lock.json`** makes installs reproducible; use `npm ci` to install the locked dependencies.
- **`.nvmrc`** identifies the Node.js version used as the setup baseline.
- **`eslint.config.js`** applies the shared JavaScript lint rules to the project.

## Environment variables

The API uses `PORT` and `FRONTEND_ORIGIN`. The frontend can use `VITE_API_URL` when it starts making API requests. Copy each workspace's `.env.example` to `.env` only when you want to override the local defaults.

## Student model

STU-BE-01 adds a SQLite `students` table and a persistence model in
`backend/src/models/studentModel.js`. Students have an integer ID, a unique
username, and a `password_hash` column. Password hashing and authentication
belong to later tickets; callers must pass a hash, not a plaintext password,
to the model. Run `npm test` from the repository root to check the model.

The subject search and student models currently use `better-sqlite3`, while
the grade model uses `sqlite3`. Agree on a shared database connection before
connecting the grade model through API routes.
