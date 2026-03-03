# Red-Team Capstone Project - CodyMatch

![red-capstone](red-capstone.png)

**CodyMatch** is an educational competitive coding platform designed for programming education. It enables teachers to create coding challenges where students compete in real-time matches, submit solutions, participate in peer review, and receive scores based on their performance.

**Project**: Red Team Capstone  
**Product Owner**: @SepidehMot Sepideh Mottaghi
**Scrum Master**: @DelaramDoroud Delaram Doroudgarian  
**Jira Project**: [RT - Red](https://capstone-red-team.atlassian.net/jira/software/projects/RT)

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Domain Model](#domain-model)
- [Workflow](#workflow)
- [Getting Started](#getting-started)
- [Development](#development)
- [Project Management](#project-management)
- [Contributing](#contributing)
- [Terminology](#terminology)

## Overview

CodyMatch transforms traditional coding assignments into engaging competitive experiences. Teachers create challenges with coding problems, and students compete in timed matches. The platform includes:

- **Real-time coding environment** with instant feedback
- **Automated code execution** using Docker containers (Judge0)
- **Three-phase workflow**: Coding → Peer Review → Scoring
- **Fair match assignment** algorithms for balanced competition
- **Comprehensive test validation** (public and private tests)

## Key Features

### For Teachers

- Create and manage coding challenges with multiple problems
- Define match settings with problem statements, test cases, and reference solutions
- Schedule challenges with customizable durations
- Monitor student participation and progress in real-time
- Automatic student-to-match assignment
- Peer review configuration and management
- View comprehensive results and analytics

### For Students

- Join scheduled challenges
- Compete in assigned matches with code editor
- Write, test, and submit code solutions
- Review peers' code and provide feedback
- Vote on solution correctness with test case validation
- Track personal progress and scores

## Architecture

CodyMatch follows a three-tier containerized architecture:

```text
┌─────────────────────────────────────────────────────┐
│                   Frontend (Next.js)                │
│              Port 3000 (internal)                   │
│   React 19, Redux Toolkit, Monaco Editor           │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│              Backend (Node.js/Express)              │
│              Port 3001 (external)                   │
│   REST API, Session Management, Code Runner         │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│              Database (PostgreSQL 16)               │
│                   Port 5432                         │
│   Sequelize ORM, Migration-based Schema             │
└─────────────────────────────────────────────────────┘
```

### Architecture Highlights

- **Backend as Reverse Proxy**: Backend proxies frontend requests and handles WebSocket connections
- **Code Execution**: Isolated Docker containers using Judge0 compilers image
- **State Management**: Redis for session storage, BullMQ for job queues
- **Real-time Updates**: WebSocket support for live challenge updates

## Technology Stack

### Frontend

- **Framework**: Next.js 16.0 (React 19)
- **State Management**: Redux Toolkit with Redux Persist
- **UI Components**: Radix UI, Tailwind CSS
- **Code Editor**: Monaco Editor (VS Code engine)
- **Testing**: Vitest, Testing Library
- **Styling**: CSS Modules, Tailwind CSS

### Backend

- **Runtime**: Node.js 25.x
- **Framework**: Express 5.2
- **ORM**: Sequelize 6.37 with Umzug migrations
- **Database**: PostgreSQL 16
- **Session**: express-session with connect-pg-simple
- **Job Queue**: BullMQ with Redis (IORedis)
- **Code Execution**: Docker SDK, Judge0 compilers
- **Validation**: AJV (JSON Schema)
- **Testing**: Vitest, Supertest
- **Logging**: Winston, Morgan

### DevOps

- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions (configured)
- **Code Quality**: ESLint, Prettier, Stylelint
- **Git Hooks**: Husky with lint-staged
- **Version Control**: Git, GitHub

## Project Structure

```text
Red-team/
├── backend/                    # Node.js/Express API server
│   ├── config/                # Database and app configuration
│   ├── migrations/            # Sequelize database migrations
│   ├── models/                # Sequelize models
│   │   ├── challenge.js
│   │   ├── match.js
│   │   ├── submission.js
│   │   └── user.js
│   ├── routes/
│   │   ├── api/               # API endpoints for internal use
│   │   └── rest/              # REST API controllers
│   │       ├── challenge-controller.js
│   │       ├── match-setting-controller.js
│   │       ├── run-controller.js
│   │       └── submission-controller.js
│   ├── services/              # Business logic and utilities
│   │   ├── assign-matches.js
│   │   ├── code-runner.js
│   │   ├── code-execution-queue.js
│   │   ├── execute-code-tests.js
│   │   └── start-challenge.js
│   ├── schemas/               # JSON Schema validation
│   ├── tests/                 # Backend tests
│   └── app.js                 # Express app entry point
│
├── frontend/                   # Next.js application
│   ├── app/                   # Next.js app router pages
│   │   ├── challenges/
│   │   ├── new-challenge/
│   │   ├── student/
│   │   └── login/
│   ├── assets/
│   │   ├── components/        # Reusable React components
│   │   ├── css/               # Global styles
│   │   ├── js/                # Utilities and store
│   │   └── modules/           # Feature modules
│   ├── services/              # API client services
│   └── tests/                 # Frontend tests
│
├── docker/                     # Docker configuration
│   ├── docker-compose.yml
│   ├── docker-compose-development.yml
│   ├── docker-compose-production.yml
│   ├── codymatch.sh           # Docker orchestration script
│   └── example.env
│
├── setup.sh                    # Development environment setup
├── SETUP.md                    # Setup instructions
├── AGENTS.md                   # AI agent guidelines
└── README.md                   # This file
```

## Domain Model

### Core Entities

#### Challenge

A challenge is a timed competition containing multiple matches. Teachers create challenges and students join them.

- **Status Flow**: `private` → `public` → `assigned` → `coding_phase` → `peer_review_phase` → `scoring_phase` → `completed`
- **Key Fields**: title, duration, startDatetime, durationPeerReview, allowedNumberOfReview

#### Match Setting

A reusable template defining a coding problem with test cases and reference solution.

- **Validation States**: `draft` → `ready`
- **Contains**: problem statement, reference solution, public tests, private tests

#### Match

An instance of a match setting within a challenge, assigned to a group of students.

- **Lifecycle**: Created during assignment → Active during coding phase → Evaluated → Completed
- **Tracks**: student submissions, test results, timestamps

#### Submission

A student's code solution for a match.

- **Metadata**: code content, language, submission timestamp
- **Results**: compiler output, passed tests count, execution status

#### User

Represents students and teachers.

- **Roles**: student, teacher
- **Authentication**: bcrypt-hashed passwords, session-based

#### Challenge Participant

Junction entity linking students to challenges with join status.

## Workflow

### 1. Challenge Creation (Teacher)

1. Teacher creates match settings with problems and test cases
2. Teacher validates match settings (`draft` → `ready`)
3. Teacher creates a challenge by selecting validated match settings
4. System marks challenge as `public` when start datetime arrives

### 2. Student Enrollment

1. Students see available challenges matching current datetime
2. Students click "Join" and wait for teacher to start
3. Teacher reviews joined students list

### 3. Match Assignment

1. Teacher clicks "Assign" button
2. System automatically distributes students into multiple simultaneous matches
3. Each match setting gets at least one match instance
4. Students are randomly assigned ensuring fair distribution
5. No student is assigned to multiple matches

### 4. Coding Phase

1. Teacher starts the challenge (status → `coding_phase`)
2. Students redirected to coding interface with countdown timer
3. Students write code in Monaco editor
4. Students click "Run" to test against public test cases
5. Students click "Submit" when satisfied (multiple submissions allowed)
6. System executes code against both public and private tests
7. Phase ends when timer expires (auto-submit if code compiles)

### 5. Peer Review Assignment

1. After coding phase ends, system shows valid submissions count per match
2. Teacher sets expected reviews per submission and clicks "Assign"
3. System assigns peer review tasks ensuring:
   - Only valid submissions (passed all public tests) are reviewed
   - Fair distribution of review tasks among students
   - No self-review
   - Reviews restricted to same match participants

### 6. Peer Review Phase

1. Teacher starts peer review (status → `peer_review_phase`)
2. Students see assigned solutions with countdown timer
3. For each solution, students vote: Correct / Incorrect / Abstain
4. "Incorrect" votes require providing a failing test case
5. System validates test cases aren't duplicates of public tests
6. Progress bar tracks completion
7. Students can exit early or continue until timer expires
8. Auto-finalization when timer reaches zero

### 7. Scoring Phase

1. System calculates scores based on:
   - Private test cases passed
   - Peer review accuracy
   - Participation metrics
2. Results displayed to students and teacher

## Getting Started

### Prerequisites

- **Node.js**: 25.x
- **npm**: 11.x
- **Docker**: Engine 28.x or higher
- **Docker Compose**: v2 (plugin)
- **Git**: Latest version
- **Shell**: bash (Linux/macOS), WSL2/Git Bash (Windows)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/DelaramDoroud/Red-team.git
   cd Red-team
   ```

2. **Run setup script**:

   ```bash
   ./setup.sh
   ```

   This script will:
   - Verify Node, npm, Docker, and Docker Compose versions
   - Install Git hooks for code quality
   - Create `.env` files from templates
   - Set up development environment

3. **Start the application**:

   ```bash
   cd docker
   ./codymatch.sh bul
   ```

   The application will be available at `http://localhost:3001`

For detailed setup instructions, see [SETUP.md](SETUP.md).

## Development

### Running in Development Mode

```bash
cd docker
./codymatch.sh bul  # Build, up, and attach logs
```

### Running Tests

**Backend tests**:

```bash
cd backend
npm test                  # Watch mode
npm run test:run          # Single run
npm run test:coverage     # With coverage
```

**Frontend tests**:

```bash
cd frontend
npm test
npm run test:coverage
```

### Code Quality

Linting and formatting are enforced via Git hooks (pre-commit).

**Manual checks**:

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
npm run lint:scss
npm run format
```

### Database Migrations

**Create a new migration**:

```bash
cd backend
npm run migration:new
```

**Run migrations**:

```bash
npm run migrate
```

**Rollback**:

```bash
npm run migrate-undo
```

### Environment Variables

Key environment variables (defined in `docker/.env`):

```env
DB_PASSWORD=your_db_password
DB_PORT=5432
CODE_RUNNER_IMAGE=judge0/compilers:latest
SESSION_SECRET=your_session_secret
```

## Project Management

### Jira Workspace

- **Project**: Red (RT)
- **URL**: <https://capstone-red-team.atlassian.net>
- **Issue Types**: Story, Epic, Subtask

### Current Sprint (Sprint 3)

Key user stories in development:

- **RT-118**: Exit Peer Review
- **RT-122**: Finalize Peer Review on Timer Expiration
- **RT-6**: Voting After Reviewing
- **RT-123**: Navigate and Review Assigned Peer Review Solutions
- **RT-116**: Start Peer Review
- **RT-115**: Peer Review Assignment
- **RT-125**: Refinements of previous sprint

### Epics

The project is organized into major epics:

- **RT-38**: Technical Setup
- **RT-39**: User Authentication
- **RT-26**: Challenge Management
- **RT-27**: Student Challenge
- **RT-30**: Student Challenge Enrollment
- **RT-101**: Coding Phase
- **RT-102**: Peer Review Phase
- **RT-103**: Scoring Phase
- **RT-104**: Rewards
- **RT-29**: Shop

### Completed Stories

Major completed features include:

- Project and database setup (RT-34, RT-35)
- Challenge creation and management (RT-24)
- Student enrollment (RT-2)
- Match assignment algorithm (RT-25)
- Challenge start workflow (RT-23)
- Code editor and execution (RT-32)
- Code submission logic (RT-4)

## Contributing

### Development Guidelines

- **Incremental progress** over big bangs
- **Learn from existing code** before implementing
- **Pragmatic** over dogmatic
- **Clear intent** over clever code
- **Single responsibility** per function/class
- **Test-driven** when possible

### Code Style

- Follow existing conventions in the codebase
- Use project's ESLint and Prettier configurations
- Ensure all tests pass before committing
- Never use `--no-verify` to bypass commit hooks
- Text files must end with a newline

### Pull Request Process

1. Create a feature branch from `main`
2. Implement changes following coding standards
3. Ensure all tests pass
4. Update documentation if needed
5. Submit PR with clear description linking to Jira issue

## Terminology

For definitions of **Challenge**, **Match Setting**, and **Match**, see the [Domain Model](#domain-model) section above.

### Public Test

A test case that is visible to students. They can see both the input and the expected output.

### Private Test

A hidden test case, not visible to students. Only the teacher and the system know its input and expected output.

### Peer Review

The process in which students evaluate each other's submitted code solutions after the coding phase of a match. For each solution, they vote: Correct, Incorrect, or Abstain. If a student votes Incorrect, they must provide a failing test case.

### Valid Submission

A submission that passed all public test cases and is eligible for peer review.

## License

This project is part of an educational university program.

---

**Maintained by**: Capstone's Red-Team
**Last Updated**: December 2025
