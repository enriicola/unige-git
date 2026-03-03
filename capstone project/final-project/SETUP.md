# Codymatch – Development Environment

This document explains how to set up a consistent development environment for all team members (Linux, macOS, and Windows via WSL2 / Git Bash).

The goals are:

- Same **Node / npm** versions for everyone
- Same **Docker / Docker Compose** baseline
- Git hooks automatically installed
- .env files created from templates
- Avoid running random `npm install` on the host machine

---

## 1. Prerequisites

Before running anything, you should have:

- **Git**
- **Node.js**
  - Required major version: **Node 25.x**
- **npm**
  - Required major version: **npm 11.x**
- **Docker**
  - macOS / Windows: Docker Desktop
  - Linux / WSL2: Docker Engine
- **Docker Compose (v2)**
  - We use `docker compose` (the v2 plugin)

You can use any installation method you prefer, as long as the versions match the requirements above.

You also need a shell that can run `bash`:

- Linux / macOS: the default terminal is fine
- Windows: **WSL2 (Ubuntu recommended)** or **Git Bash**

---

## 2. First-time setup

From the root of the repository:

```bash
./setup.sh
```

> On Windows: run this from **WSL2** or **Git Bash**, not from PowerShell or cmd.

The script will:

1. **Check Node & npm versions**
    - Verifies:
        - Node **25.x**
        - npm **11.x**
    - If the versions do not match, the script exits with an error and asks you to align your versions.

2. **Check Docker & Docker Compose**
    - Verifies that:
        - `docker` is available
        - Docker Engine version is **≥ 28.x**
        - `docker compose` (Compose v2) is available
    - If something is missing or too old, the script exits with an error.

3. **Install Git hooks**
    - Copies hooks from:
        - `backend/.githooks`
        - `frontend/.githooks`
    - into `.git/hooks` and makes them executable.

4. **Create `.env` files**
    - If not already present, creates `.env` files for docker and for backend/test environment variables from the provided templates.
    - **If you need to customize any values in the .env files, do so after this step.**

If any step fails, fix your local environment according to the error message and run `./setup.sh` again.

---

## 3. Starting the development environment

Once `./setup.sh` has completed successfully:

```bash
cd docker
./codymatch.sh bul
```

This will:

- Build the backend and frontend images (if needed)
- Start the database, backend, and frontend containers
- Attach logs so you can see what is happening

You can stop everything using the corresponding commands defined in `codymatch.sh` (for example `./codymatch.sh down`, if available).

---

## 4. Managing dependencies (npm)

If you need to keep the team environment consistent (codymatch.sh already ensures that),

### **do not run `npm install` directly on your host machine**

Instead, always run npm commands **through Docker**, using `codymatch.sh`.

### Backend

Install all backend dependencies:

```bash
cd docker
./codymatch.sh backend npm install
```

Install a specific library:

```bash
cd docker
./codymatch.sh backend npm install <library-name>
```

### Frontend

Install all frontend dependencies:

```bash
cd docker
./codymatch.sh frontend npm install
```

Install a specific library:

```bash
cd docker
./codymatch.sh frontend npm install <library-name>
```

This ensures:

- Dependencies are installed with the same Node/npm version as in the containers.
- `package-lock.json` is generated and updated in a controlled and versioned environment.
- All 8 developers share the same behavior regardless of OS.

---

## 5. Recommended workflow for all team members

1. **You have already cloned the repository** (rename `Red-team` to `codymatch` for clarity but it's optional):

   ```bash
   git clone https://github.com/DelaramDoroud/Red-team codymatch
   cd codymatch
   ```

2. **Run the setup script**

   ```bash
   ./setup.sh
   ```

   Fix any issues reported by the script and run it again until everything passes.

3. **Start the dev environment**

   ```bash
   cd docker
   ./codymatch.sh bul
   ```

4. **Manage dependencies via Docker**

   ```bash
   cd docker
   ./codymatch.sh backend npm install <library-name>
   ./codymatch.sh frontend npm install <library-name>
   ```

5. **Commit package changes**

   Whenever you add or update dependencies, commit both `package.json` and `package-lock.json` for the backend or frontend.

---

This setup keeps all developers aligned on tools and versions while avoiding environment drift across Linux, macOS, WSL2 and Windows with Git Bash.
