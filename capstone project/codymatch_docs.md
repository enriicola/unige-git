# CodyMatch - Complete System Documentation

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Platform Overview](#platform-overview)
3. [System Architecture](#system-architecture)
4. [Technology Stack](#technology-stack)
5. [Domain Model](#domain-model)
6. [Complete Workflow](#complete-workflow)
7. [API Architecture](#api-architecture)
8. [Deployment Architecture](#deployment-architecture)
9. [Security Implementation](#security-implementation)
10. [Performance Optimizations](#performance-optimizations)
11. [Testing Strategy](#testing-strategy)
12. [Key Features Summary](#key-features-summary)
13. [Future Enhancements](#future-enhancements)
14. [Terminology](#terminology)
15. [Codebase Architecture and Implementation](#codebase-architecture-and-implementation)
16. [Code Organization & Patterns](#code-organization--patterns)
17. [Key Implementation Details](#key-implementation-details)

---

## Executive Summary

**CodyMatch** is an educational competitive coding platform designed for programming education. It enables teachers to create coding challenges where students compete in real-time matches, submit solutions, participate in peer review, and receive scores based on their performance.

**Project**: Red Team Capstone  
**Product Owner**: Sepideh Mottaghi  
**Scrum Master**: Delaram Doroudgarian  
**GitHub Repository**: [DelaramDoroud/Red-team](https://github.com/DelaramDoroud/Red-team)  
**Jira Project**: [RT - Red](https://capstone-red-team.atlassian.net/jira/software/projects/RT)

---

## Platform Overview

CodyMatch transforms traditional coding assignments into engaging competitive experiences through a unique three-phase workflow:

1. **Coding Phase**: Students compete in timed matches solving programming problems
2. **Peer Review Phase**: Students evaluate and vote on each other's solutions
3. **Scoring Phase**: Automated scoring based on test results and peer review accuracy

### Key Value Propositions

- **For Teachers**: Automate assignment distribution, grading, and peer review management with detailed analytics
- **For Students**: Gamified learning experience with real-time feedback, competitive elements, and achievement tracking
- **For Institutions**: Scalable solution for programming courses with built-in assessment tools

### Core Differentiators

- **Peer Review Integration**: Students learn by reviewing code, incentivizing quality feedback
- **Sophisticated Assignment**: Fair matching algorithms ensure balanced competition
- **Automated Grading**: Eliminates manual grading burden for teachers
- **Skill Progression**: Gamification system with badges and skill tiers
- **Transparent Evaluation**: Clear score breakdown showing coding vs. peer review components

---

## System Architecture

### High-Level Architecture

CodyMatch follows a three-tier containerized architecture with clear separation of concerns:

```text
┌──────────────────────────────────────────────────┐
│        Frontend (Next.js SPA)                    │
│        Port 3000 (internal only)                 │
│  React 19, Redux Toolkit, Monaco Editor          │
│  Tailwind CSS, Radix UI Components               │
└──────────────────────────────────────────────────┘
                      ↓ (reverse proxied)
┌──────────────────────────────────────────────────┐
│      Backend (Node.js/Express API)               │
│      Port 3001 (external facing)                 │
│  REST API, Session Management, Code Execution    │
│  Job Queue, Real-time Events (SSE)               │
└──────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│       Database (PostgreSQL 16)                   │
│       Port 5432 (internal only)                  │
│  Sequelize ORM, Migration-based Schema           │
│  Connection Pooling, Indexes                     │
└──────────────────────────────────────────────────┘
                      ↓
┌──────────────────────────────────────────────────┐
│    Code Execution Environment (Docker)           │
│    Isolated Containers, Resource Limited         │
│    Judge0 Compilers Image                        │
└──────────────────────────────────────────────────┘
```

### Architecture Highlights

- **Backend as Reverse Proxy**: Backend proxies frontend requests and serves as the API gateway
- **Code Execution Isolation**: Each code execution runs in a separate Docker container with resource limits
- **State Management**: Redis for session storage and BullMQ for job queue processing
- **Real-time Updates**: Server-Sent Events for live challenge updates without WebSocket overhead
- **Stateless Scaling**: Backend is horizontally scalable with proper session store

---

## Technology Stack

### Frontend Technologies

| Component | Technology | Version | Purpose |
| ----------- | ----------- | --------- | --------- |
| Framework | Next.js | 16.1.6 | React server-side rendering and static generation |
| Runtime | React | 19.2.4 | UI component library |
| State Management | Redux Toolkit | 2.11.2 | Centralized state with Redux Persist |
| UI Components | Radix UI | Latest | Accessible, unstyled primitives |
| Code Editor | Monaco Editor | 4.7.0 | VS Code-like editor experience |
| Styling | Tailwind CSS | Latest | Utility-first CSS framework |
| Icons | Lucide React | 0.563.0 | Icon library |
| Form Validation | AJV | 8.17.1 | JSON Schema validation |
| Testing | Vitest | Latest | Fast unit testing framework |
| Testing Library | React Testing Library | Latest | Component testing utilities |

### Backend Technologies

| Component | Technology | Version | Purpose |
| ----------- | ----------- | --------- | --------- |
| Runtime | Node.js | 25.x | JavaScript runtime |
| Framework | Express | 5.2.1 | HTTP server and API framework |
| ORM | Sequelize | 6.37.7 | Database abstraction and migrations |
| Database | PostgreSQL | 16 | Relational database |
| Session Store | connect-pg-simple | Latest | PostgreSQL session store |
| Job Queue | BullMQ | 5.66.0 | Redis-backed job queue |
| Redis Client | IORedis | 5.8.2 | High-performance Redis client |
| Validation | AJV | 8.17.1 | JSON Schema validation |
| Password Hashing | bcrypt | 6.0.0 | Secure password hashing |
| Logging | Winston | 3.19.0 | Structured logging |
| HTTP Logging | Morgan | 1.10.1 | HTTP request logging |
| Security | Helmet | 8.1.0 | HTTP security headers |
| Proxy | http-proxy | 1.18.1 | HTTP proxying for frontend |
| Testing | Vitest | Latest | Unit testing framework |
| HTTP Testing | Supertest | 7.1.4 | HTTP assertion library |

### DevOps & Infrastructure

| Component | Technology | Purpose |
| ----------- | ----------- | --------- |
| Containerization | Docker | Container images for all services |
| Orchestration | Docker Compose | Local development and production deployment |
| CI/CD | GitHub Actions | Automated testing and deployment |
| Code Quality | ESLint | JavaScript linting |
| Code Formatting | Prettier | Code formatting consistency |
| CSS Linting | Stylelint | CSS/SCSS linting |
| Git Hooks | Husky | Pre-commit hooks for code quality |
| Code Migration | Umzug | Database migration management |

---

## Domain Model

### Core Data Entities and Relationships

#### 1. Challenge

Represents a timed competition containing multiple matches that students can join and compete in.

**Key Fields**:

- `id` (Primary Key): Unique identifier
- `title` (String): Challenge name/title
- `status` (Enum): Current state in challenge lifecycle
- `durationCodingPhase` (Integer): Time allocated for coding in minutes
- `durationPeerReview` (Integer): Time allocated for peer review in minutes
- `startDatetime` (DateTime): When the challenge becomes available
- `startedAt` (DateTime): When coding phase actually started
- `createdBy` (FK to User): Teacher who created the challenge
- `allowedNumberOfReview` (Integer): Target reviews per submission
- `scoringStatus` (Enum): 'pending' | 'computing' | 'completed'

**Status Flow**:

```text
private → public → assigned → coding_phase → 
peer_review_phase → scoring_phase → completed
```

**Status Descriptions**:

- `private`: Draft state, only visible to creator
- `public`: Published and visible to students for enrollment
- `assigned`: Students assigned to matches, ready for coding
- `coding_phase`: Active coding, students submitting solutions
- `peer_review_phase`: Active peer review phase
- `scoring_phase`: Automated scoring computation in progress
- `completed`: Challenge finished with results available

**Relationships**:

- One Challenge has many ChallengeMatchSettings
- One Challenge has many ChallengeParticipants
- One Challenge has many Matches
- One Challenge has many SubmissionScoreBreakdowns

#### 2. Match Setting (Problem Template)

A reusable template defining a coding problem with test cases and reference solution.

**Key Fields**:

- `id` (Primary Key): Unique identifier
- `title` (String): Problem title
- `description` (Text): Problem statement in HTML format
- `language` (String): Programming language ('cpp', 'python', 'java', 'javascript')
- `referenceSolution` (Text): Teacher's correct solution code
- `publicTestCases` (JSON): Visible test cases, array of `{input, expectedOutput}`
- `privateTestCases` (JSON): Hidden test cases for final evaluation
- `status` (Enum): 'draft' | 'ready'
- `importsBlock` (Text): Required imports/headers for the language
- `createdBy` (FK to User): Teacher who created this

**Validation States**:

- `draft`: Being created, not yet validated
- `ready`: Validated against reference solution, ready for use in challenges

**Test Case Structure**:

```json
{
  "input": "5 10",
  "expectedOutput": "15"
}
```

**Relationships**:

- One MatchSetting has many ChallengeMatchSettings
- One MatchSetting has many Matches (one match per challenge)

#### 3. Match

An instance of a match setting within a challenge, assigned to a specific group of students.

**Key Fields**:

- `id` (Primary Key): Unique identifier
- `challengeId` (FK): Parent challenge
- `challengeMatchSettingId` (FK): Which match setting this is based on
- `matchNumber` (Integer): Sequential number within the challenge

**Purpose**: Enables multiple student groups to work on the same problem simultaneously within one challenge, ensuring fair competition.

**Relationships**:

- One Match belongs to one Challenge
- One Match contains many Submissions
- One Match has many ChallengeParticipants assigned

#### 4. Challenge Match Setting

Junction entity linking match settings to challenges with ordering.

**Key Fields**:

- `id` (Primary Key)
- `challengeId` (FK): Which challenge
- `matchSettingId` (FK): Which problem template
- `orderInChallenge` (Integer): Display order if multiple problems

**Purpose**: Enables reuse of match settings across multiple challenges.

#### 5. Submission

A student's code solution for a match.

**Key Fields**:

- `id` (Primary Key)
- `matchId` (FK): Which match this submission is for
- `participantId` (FK): Which student submitted
- `code` (Text): Student's source code
- `language` (String): Language used
- `submittedAt` (DateTime): When submitted
- `compilationMessage` (Text): Compiler output or errors
- `executionStatus` (String): 'success' | 'compilation_error' | 'runtime_error' | 'timeout'
- `passedPublicTests` (Integer): Number of public tests passed
- `passedPrivateTests` (Integer): Number of private tests passed (set at score time)
- `totalPublicTests` (Integer): Total public tests
- `totalPrivateTests` (Integer): Total private tests
- `status` (Enum): 'valid' | 'invalid' | 'pending'
- `isFinal` (Boolean): Is this the student's final submission?

**Submission Status**:

- `valid`: Passed all public tests, eligible for peer review
- `invalid`: Failed some public tests
- `pending`: Still being evaluated

**Business Rules**:

- Multiple submissions allowed per student
- Most recent valid submission marked as `isFinal`
- Auto-submitted at phase end if no valid submission exists

**Relationships**:

- One Submission belongs to one Match
- One Submission belongs to one ChallengeParticipant
- One Submission has many PeerReviewAssignments
- One Submission has one SubmissionScoreBreakdown

#### 6. User

Represents students and teachers in the system.

**Key Fields**:

- `id` (Primary Key)
- `username` (String, Unique): Login username
- `email` (String, Unique): Email address
- `password` (String): bcrypt-hashed password (never in plaintext)
- `fullName` (String): Display name
- `role` (Enum): 'student' | 'teacher' | 'admin'
- `titleId` (FK to Title): Current skill tier

**Authentication**: Session-based using express-session with PostgreSQL store

**Relationships**:

- One User has many Challenges created
- One User has many ChallengeParticipants (for students)
- One User has many StudentBadges (achievements earned)
- One User has one Title (skill tier)

#### 7. Challenge Participant

Junction entity linking students to challenges they've enrolled in.

**Key Fields**:

- `id` (Primary Key): Unique identifier
- `challengeId` (FK): Which challenge
- `studentId` (FK to User): Which student
- `joinedAt` (DateTime): When they enrolled
- `matchId` (FK to Match): Which match they're assigned to

**Purpose**: Tracks enrollment and match assignment.

**Relationships**:

- One ChallengeParticipant has many Submissions
- One ChallengeParticipant has many PeerReviewAssignments (as reviewer)
- One ChallengeParticipant has one SubmissionScoreBreakdown

#### 8. Peer Review Assignment

Tracks which student should review which submission.

**Key Fields**:

- `id` (Primary Key)
- `reviewerId` (FK to ChallengeParticipant): Who is reviewing
- `submissionId` (FK): What submission to review
- `assignedAt` (DateTime): When the assignment was created
- `isExtra` (Boolean): Extra review beyond base requirement? (for bonus points)

**Purpose**: Ensures fair distribution of review workload.

**Relationships**:

- One PeerReviewAssignment has zero or one PeerReviewVote
- One PeerReviewAssignment links to one Submission

#### 9. Peer Review Vote

Stores a student's vote and test case for a reviewed submission.

**Key Fields**:

- `id` (Primary Key)
- `peerReviewAssignmentId` (FK)
- `vote` (Enum): 'correct' | 'incorrect' | 'abstain'
- `testCaseInput` (Text): Test input provided by reviewer (for 'incorrect' votes)
- `expectedOutput` (Text): Expected output for the test case
- `notes` (Text): Optional explanation or hint
- `isValidated` (Boolean): Did the test case pass validation?
- `failedReferenceCheck` (Boolean): Did test case fail against reference solution?
- `submittedAt` (DateTime): When vote was cast

**Validation Process**:

1. Check test case is not duplicate of public tests
2. Run against reviewed code (must fail)
3. Run against reference solution (must pass)
4. Mark validation status

**Relationships**:

- One PeerReviewVote belongs to one PeerReviewAssignment

#### 10. Submission Score Breakdown

Detailed scoring information for each participant in a challenge.

**Key Fields**:

- `id` (Primary Key)
- `challengeId` (FK)
- `participantId` (FK to ChallengeParticipant)
- `peerReviewScore` (Decimal): 0-100 points from reviewing accuracy
- `codingPhaseScore` (Decimal): 0-100 points from private tests
- `totalScore` (Decimal): Final combined score
- `correctVotes` (Integer): Accurate votes cast by reviewer
- `incorrectVotes` (Integer): Inaccurate votes cast by reviewer
- `abstainVotes` (Integer): Votes where reviewer abstained
- `receivedCorrectVotes` (Integer): "Correct" votes on their solution
- `receivedIncorrectVotes` (Integer): "Incorrect" votes on their solution
- `assignmentsTotal` (Integer): Total peer reviews assigned to student
- `passedPrivateTests` (Integer): Private tests their solution passed
- `totalPrivateTests` (Integer): Total private tests

**Relationships**:

- One SubmissionScoreBreakdown per ChallengeParticipant per Challenge

#### 11. Badge

Defines achievements students can earn through the gamification system.

**Key Fields**:

- `id` (Primary Key)
- `key` (String, Unique): Machine-readable identifier ('CHALLENGE_STREAK_3')
- `name` (String): Display name ("3-Challenge Streak")
- `description` (Text): Badge description
- `iconKey` (String): Reference to badge icon asset
- `category` (Enum): Badge type ('CHALLENGE_MILESTONE', 'PERFORMANCE', 'STREAK')
- `metric` (Enum): What is measured ('CHALLENGES_COMPLETED', 'CONSECUTIVE_DAYS')
- `threshold` (Integer): Value required to earn badge
- `level` (Integer): Badge tier (1, 2, 3, etc.)

**Badge Categories**:

- `CHALLENGE_MILESTONE`: Completing N challenges
- `PERFORMANCE`: Special achievements (First Try Hero, Speed Coder)
- `STREAK`: Consecutive activity tracking

**Relationships**:

- One Badge can be awarded to many Students (via StudentBadge)

#### 12. Student Badge

Junction entity tracking which badges students have earned.

**Key Fields**:

- `id` (Primary Key)
- `studentId` (FK to User)
- `badgeId` (FK to Badge)
- `awardedAt` (DateTime): When badge was earned

**Purpose**: Gamification tracking for student profiles.

#### 13. Title (Skill Tier)

Defines skill tiers for students (similar to competitive programming platforms like Codeforces).

**Key Fields**:

- `id` (Primary Key)
- `name` (String): Title name
- `minRating` (Integer): Minimum rating required
- `maxRating` (Integer): Maximum rating threshold
- `color` (String): Display color (hex or named)
- `level` (Integer): Numeric tier level (1-7)

**Title Progression**:

1. Newbie (Gray) - Entry level, 0-800 rating
2. Pupil (Green) - Consistent pass, 800-1200
3. Specialist (Cyan) - Reliable, 1200-1600
4. Expert (Blue) - High skill, 1600-2000
5. Candidate Master (Purple) - Very high, 2000-2400
6. Master (Orange) - Top 1%, 2400-3000
7. Grandmaster (Red) - World class, 3000+

**Relationships**:

- One Title can be assigned to many Users

---

## Complete Workflow

### Phase 0: Teacher Setup

#### 0.1 Create Match Settings (Coding Problems)

**Teacher Actions**:

1. Navigate to "Match Settings" page
2. Click "Create Match Setting"
3. Fill in problem details:
   - Title and description (HTML rich text editor)
   - Select programming language
   - Write reference solution code
   - Add public test cases (visible to students)
   - Add private test cases (hidden for evaluation)
   - Specify required imports/headers
4. Click "Validate" to test reference solution against all test cases
5. If validation passes, status changes from 'draft' to 'ready'

**Validation Process**:

```text
Reference Solution Validation
├─ Compile reference code in selected language
├─ Run against all public test cases
├─ Run against all private test cases
├─ Verify all tests pass
└─ Set status to 'ready' (or show error)
```

**Error Cases**:

- Compilation errors: Display compiler message
- Test failures: Show which tests failed with actual vs. expected
- Invalid imports: Suggest missing imports

**Backend Process**:

- Validates JSON structure of test cases
- Creates Docker container with Judge0 compiler image
- Executes reference solution
- Validates all test cases pass
- Stores match setting in database

#### 0.2 Create Challenge

**Teacher Actions**:

1. Navigate to "New Challenge" page
2. Fill in challenge configuration:
   - Title
   - Start date and time (when students can join)
   - Coding phase duration in minutes (5-480 minutes typical)
   - Peer review phase duration in minutes
   - Expected reviews per submission (1-5, typical 2-3)
3. Select one or more validated match settings to include
4. Click "Create Challenge"
5. Challenge status set to 'private' (draft)
6. Teacher can publish when ready

**Backend Process**:

- Validates all input data via JSON Schema
- Creates Challenge record with status='private'
- Creates ChallengeMatchSetting records for each selected problem
- Schedules challenge to change status from private→public at startDatetime

---

### Phase 1: Student Enrollment

#### 1.1 Student Joins Challenge

**System Discovery**:

- Student logs in
- Navigates to "Challenges" page
- System displays challenges where:
  - `status = 'public'`
  - Current time >= `startDatetime`
  - Student hasn't already joined

**Student Actions**:

1. Reviews challenge title, description, and duration
2. Clicks "Join" button
3. System creates ChallengeParticipant record
4. Student sees "Joined" status and waits for teacher to start

**Backend Process**:

- Validates student hasn't already joined
- Creates ChallengeParticipant with `joinedAt = NOW()`
- Broadcasts real-time event: `{ event: 'participant-joined', challengeId, count }`
- Teacher's view updates with new enrollment count

#### 1.2 Teacher Reviews Participants

**Teacher Actions**:

1. Navigate to challenge details
2. View "Participants" list with real-time updates
3. See enrollment count and student names
4. Decide when sufficient students have enrolled
5. Click "Assign Matches" button

---

### Phase 2: Match Assignment

#### 2.1 Automatic Match Assignment Algorithm

**Teacher Triggers Assignment**:

- Clicks "Assign Matches" button
- System executes sophisticated assignment algorithm

**Assignment Goals**:

```text
✓ Each match setting gets adequate instances (4-5 students per match typical)
✓ All students assigned to exactly one match
✓ Random distribution ensures fairness
✓ Balance maintained across all match instances
```

**Algorithm Implementation**:

```javascript
// Step 1: Determine match instances needed per match setting
const participantsCount = totalStudents;
const maxStudentsPerMatch = 4; // Configurable
const instancesPerSetting = Math.ceil(participantsCount / maxStudentsPerMatch);

// Step 2: Create match instances
for (let settingIndex = 0; settingIndex < matchSettings.length; settingIndex++) {
  for (let i = 0; i < instancesPerSetting; i++) {
    createMatch({
      challengeId,
      challengeMatchSettingId: matchSettings[settingIndex].id,
      matchNumber: i + 1
    });
  }
}

// Step 3: Random distribution to ensure fairness
const shuffledParticipants = shuffleArray([...participants]);
for (let i = 0; i < shuffledParticipants.length; i++) {
  const settingIndex = Math.floor(i / instancesPerSetting) % matchSettings.length;
  const matchInstanceIndex = i % instancesPerSetting;
  const matchId = matches[settingIndex * instancesPerSetting + matchInstanceIndex].id;
  
  assignParticipantToMatch(shuffledParticipants[i], matchId);
}
```

**Result**:

- Multiple Match instances created (e.g., 3 matches for Match Setting A, 3 for B)
- Each student assigned to one match
- Balanced distribution across instances
- Challenge status changes to 'assigned'

**Backend Process**:

- Transaction-based for atomicity
- Fetches all participants
- Retrieves all match settings for the challenge
- Creates match instances
- Randomly distributes with fairness constraints
- Updates participant.matchId
- Broadcasts event: `{ event: 'matches-assigned', challengeId }`

---

### Phase 3: Coding Phase

#### 3.1 Teacher Starts Challenge

**Teacher Action**:

- Clicks "Start Challenge" button

**System Actions**:

1. Updates Challenge status: 'assigned' → 'coding_phase'
2. Records `Challenge.startedAt = NOW()`
3. Schedules automatic phase end
4. Broadcasts event to all participants
5. Redirects all students to coding interface

**Backend Scheduler** (BullMQ):

```javascript
const codingPhaseEndTime = startedAt + (durationCodingPhase * 60 * 1000);
const gracePeriodEndTime = codingPhaseEndTime + GRACE_PERIOD_MS; // 30 seconds

await schedulePhaseOneEndForChallenge(challengeId, codingPhaseEndTime, gracePeriodEndTime);
```

#### 3.2 Student Coding Experience

**Coding Interface Components**:

```text
┌─────────────────────────────────────────────────────────┐
│ Timer: 59:45 remaining        [Exit] [Submit]           │
├─────────────────────────────────────────────────────────┤
│ Problem Statement (HTML)      │  Code Editor (Monaco)   │
│ ┌──────────────────────────┐  │  ┌────────────────────┐ │
│ │ Write a function that    │  │  │ #include<iostream> │ │
│ │ computes the sum of two  │  │  │ using namespace std;│ │
│ │ integers.                │  │  │                    │ │
│ │                          │  │  │ int main() {       │ │
│ │ Input: two integers a,b  │  │  │   // Your code     │ │
│ │ Output: a + b            │  │  │ }                  │ │
│ │                          │  │  │                    │ │
│ │ Public Tests:            │  │  │  [Run] [Submit]   │ │
│ │ Test 1: 5 + 10 = 15 ✓    │  │  │                    │ │
│ │ Test 2: -3 + 7 = 4 ✓     │  │  └────────────────────┘ │
│ │ Test 3: 0 + 0 = 0 ✓      │  │                         │
│ └──────────────────────────┘  │  Previous Submissions:  │
│                               │  1. submitted 10:32 ✓   │
│                               │  2. submitted 09:15 ✗   │
│                               │  3. submitted 08:00 ✓   │
└─────────────────────────────────────────────────────────┘
```

**Student Actions**:

1. Reads problem statement
2. Studies public test cases
3. Writes code in Monaco editor with:
   - Syntax highlighting
   - Line numbers
   - Bracket matching
   - IntelliSense/autocomplete
   - Undo/redo

#### 3.3 Code Execution: Run vs. Submit

**Run Code (Test Locally)**:

```text
Student clicks "Run"
       ↓
Frontend sends: POST /run
{
  code: "student's code",
  language: "cpp",
  testCases: [public test cases],
  userId: studentId
}
       ↓
Backend enqueues job in BullMQ
       ↓
Code Execution Worker picks up job
       ↓
Docker Container Creation (Judge0)
├─ Image: judge0/compilers:latest
├─ Resource Limits:
│  ├─ CPU: 1 core
│  ├─ Memory: 512MB
│  ├─ Execution Time: 5 seconds
│  └─ Disk: None (ephemeral)
└─ Network: None (isolated)
       ↓
Execute code against each public test case
       ↓
Return results:
{
  isCompiled: true,
  results: [
    {
      input: "5 10",
      expectedOutput: "15",
      actualOutput: "15",
      passed: true
    },
    {
      input: "-3 7",
      expectedOutput: "4",
      actualOutput: "4",
      passed: true
    },
    {
      input: "0 0",
      expectedOutput: "0",
      actualOutput: "0",
      passed: true
    }
  ],
  compilationMessage: "Success"
}
       ↓
Frontend displays results immediately
```

**Compilation Error Case**:

```javascript
{
  isCompiled: false,
  results: [],
  compilationMessage: "error: 'cout' was not declared in this scope"
}
```

**Submit Code (Final Submission)**:

```text
Student clicks "Submit"
       ↓
Frontend sends: POST /submissions
{
  code: "student's final code",
  language: "cpp",
  matchId: matchId
}
       ↓
Backend creates Submission record:
{
  matchId,
  participantId,
  code,
  language,
  submittedAt: NOW(),
  status: 'pending'
}
       ↓
Enqueues evaluation job (BullMQ)
       ↓
Code Execution Worker:
1. Execute against ALL test cases (public + private)
2. Count passed tests
3. Determine compilation status
       ↓
Update Submission:
{
  executionStatus: 'success' | 'compilation_error' | etc.,
  passedPublicTests: 3,
  passedPrivateTests: 3 (evaluated in scoring, not shown now),
  status: 'valid' (if passed all public) | 'invalid',
  isFinal: true (overwrite previous final submission)
}
       ↓
Frontend shows submission receipt:
✓ Submission accepted
✓ 3/3 public tests passed
✓ Status: Valid (eligible for peer review)
```

**Multiple Submissions**:

- Students can submit multiple times
- Each submission independently evaluated
- Latest valid submission becomes the final submission
- Final submission is what gets peer reviewed

**Code Execution Security**:

```text
Security Measures:
├─ Isolated Container: No host access
├─ Resource Limits:
│  ├─ CPU limited to prevent infinite loops
│  ├─ Memory limited to prevent memory bombs
│  ├─ Time limited (timeout enforcement)
│  └─ Disk I/O limited (no filesystem access)
├─ No Network Access: Container cannot reach internet/network
├─ Input Validation: Test inputs sanitized before execution
└─ Container Cleanup: Container destroyed after execution
```

#### 3.4 Automatic Phase End

**Timer Expires**:

```text
Countdown reaches 00:00
       ↓
Scheduler triggers: schedulePhaseOneEndForChallenge()
       ↓
1. Check for in-flight submissions (still being evaluated)
       ↓
2. Wait for grace period (30 seconds)
       ↓
3. For each participant without isFinal submission:
   a. Find last compiled (non-error) submission
   b. If exists: Auto-submit it as final
   c. If none: Create empty submission with error status
       ↓
4. Update Challenge:
   status: 'ended_phase_one'
   scoringStatus: 'pending'
       ↓
5. Broadcast event: 
   { event: 'coding-phase-ended', challengeId }
       ↓
Students automatically redirected (if still on page)
```

**Auto-Submission Logic**:

```javascript
// For each participant
for (const participant of participants) {
  const finalSubmission = await findFinalSubmission(participant.id);
  
  if (finalSubmission) {
    // Already has a final submission, do nothing
    continue;
  }
  
  // Try to find last compiled (non-error) submission
  const lastCompiled = await findLastCompiledSubmission(participant.id);
  
  if (lastCompiled && lastCompiled.executionStatus === 'success') {
    // Auto-submit this as final
    lastCompiled.isFinal = true;
    await lastCompiled.save();
  } else {
    // Create empty/error submission
    const emptySubmission = await Submission.create({
      matchId,
      participantId,
      code: '',
      language: matchSetting.language,
      status: 'invalid',
      isFinal: true,
      executionStatus: 'no_submission',
      passedPublicTests: 0,
      totalPublicTests: matchSetting.publicTestCases.length
    });
  }
}
```

---

### Phase 4: Peer Review Assignment

#### 4.1 Teacher Reviews Valid Submissions

**Challenge Status**: 'ended_phase_one'

**Teacher Actions**:

1. Navigate to "Peer Review Assignment" page
2. System displays:
   - Per-match breakdown
   - Valid submissions per match (passed all public tests)
   - Recommended reviews per submission
   - Graphs/stats
3. Teacher can adjust "Expected Reviews Per Submission"
4. Clicks "Assign Peer Reviews" button

**Assignment Display**:

```text
Match 1 (5 participants):
├─ Total participants: 5
├─ Valid submissions: 4 (one failed public tests)
├─ Expected reviews per submission: 3
└─ Total reviews to assign: 12

Match 2 (4 participants):
├─ Total participants: 4
├─ Valid submissions: 4
├─ Expected reviews per submission: 3
└─ Total reviews to assign: 12

Total reviews across challenge: 24
```

#### 4.2 Peer Review Assignment Algorithm

**Algorithm Goals**:

```text
✓ Only valid submissions are reviewed
✓ Each valid submission gets ~N reviews (target)
✓ Reviews distributed fairly (all students get similar workload)
✓ No student reviews their own code
✓ Reviews restricted to same-match participants
✓ Extra reviews marked for bonus consideration
```

**Algorithm Implementation**:

```javascript
async function assignPeerReviewsForChallenge(challengeId, reviewsPerSubmission) {
  // Step 1: Filter valid submissions per match
  const matchSubmissions = new Map(); // matchId → [valid submissions]
  
  for (const match of challenge.matches) {
    const validSubmissions = match.submissions.filter(s => 
      s.status === 'valid' && s.isFinal
    );
    matchSubmissions.set(match.id, validSubmissions);
  }
  
  // Step 2: Get reviewers for each match
  const matchReviewers = new Map(); // matchId → [participants]
  for (const match of challenge.matches) {
    const reviewers = match.participants.filter(p => 
      // Only students with valid submissions can review
      hasValidSubmission(p)
    );
    matchReviewers.set(match.id, reviewers);
  }
  
  // Step 3: Calculate target review counts
  const targetCounts = new Map(); // submissionId → target count
  for (const [matchId, submissions] of matchSubmissions) {
    const baseReviews = reviewsPerSubmission;
    const extraReviews = (submissions.length * baseReviews) % submissions.length;
    
    for (const submission of submissions) {
      targetCounts.set(submission.id, baseReviews);
    }
    
    // Distribute extra reviews
    for (let i = 0; i < extraReviews; i++) {
      const submissionId = submissions[i % submissions.length].id;
      targetCounts.set(submissionId, targetCounts.get(submissionId) + 1);
    }
  }
  
  // Step 4: Build bipartite graph and apply max flow algorithm
  // Left side: reviewers (students)
  // Right side: submissions to review
  // Edge: reviewer from same match can review submission
  
  const assignments = await maxFlowAssignment({
    reviewers: matchReviewers,
    submissions: matchSubmissions,
    targetCounts,
    constraintsSameMatch: true
  });
  
  // Step 5: Mark assignments as "extra" if beyond base requirement
  const markedAssignments = markExtraAssignments(
    assignments,
    reviewsPerSubmission
  );
  
  // Step 6: Create database records
  for (const assignment of markedAssignments) {
    await PeerReviewAssignment.create({
      reviewerId: assignment.reviewerId,
      submissionId: assignment.submissionId,
      assignedAt: new Date(),
      isExtra: assignment.isExtra
    });
  }
  
  // Step 7: Update challenge status
  challenge.status = 'assigned_peer_review';
  await challenge.save();
  
  return markedAssignments;
}
```

**Max Flow Algorithm**:
Uses network flow with Munkres-like matching to ensure:

- All reviewers have fair workload
- All submissions get target reviews
- Constraints (no self-review, same match) respected

**Result**:

- PeerReviewAssignment records created for each review task
- Each assignment has `isExtra` flag
- Challenge status: 'assigned_peer_review'

---

### Phase 5: Peer Review Phase

#### 5.1 Teacher Starts Peer Review

**Teacher Action**:

- Clicks "Start Peer Review" button

**System Actions**:

```text
Update Challenge status: 'assigned_peer_review' → 'peer_review_phase'
       ↓
Record current time as phase start
       ↓
Schedule automatic phase end in BullMQ:
Time = NOW() + (durationPeerReview * 60 seconds)
       ↓
Broadcast event: { event: 'peer-review-phase-started', challengeId }
       ↓
All students automatically redirected to peer review interface
```

#### 5.2 Student Peer Review Interface

**Interface Layout**:

```text
┌───────────────────────────────────────────────────────────┐
│  Timer: 29:45 remaining      Progress: 6/12 reviews       │
├───────────────────────────────────────────────────────────┤
│                                                             │
│  Submitted Solution #4 by: alice@example.com             │
│  ┌───────────────────────────────────────────────────────┐│
│  │ #include<iostream>                                    ││
│  │ using namespace std;                                  ││
│  │                                                        ││
│  │ int main() {                                          ││
│  │   int a, b;                                           ││
│  │   cin >> a >> b;                                      ││
│  │   cout << a + b << endl;                             ││
│  │   return 0;                                           ││
│  │ }                                                      ││
│  │                                                        ││
│  │ Test Results (Public):                               ││
│  │ ✓ Test 1: 5 + 10 = 15                                ││
│  │ ✓ Test 2: -3 + 7 = 4                                 ││
│  │ ✓ Test 3: 0 + 0 = 0                                  ││
│  └───────────────────────────────────────────────────────┘│
│                                                             │
│  Your Vote:                                                │
│  ⚪ Correct  ⚪ Incorrect  ⚪ Abstain                       │
│                                                             │
│  [◀ Previous] [Next ▶]  [Exit Early]                      │
│                                                             │
└───────────────────────────────────────────────────────────┘
```

#### 5.3 Voting Process

#### Vote: Correct

```text
Student clicks "Correct" button
       ↓
Frontend sends: POST /challenges/:id/peer-reviews/votes
{
  assignmentId: peerReviewAssignmentId,
  vote: 'correct'
}
       ↓
Backend creates PeerReviewVote:
{
  peerReviewAssignmentId,
  vote: 'correct',
  submittedAt: NOW()
}
       ↓
Next assignment displayed
```

#### Vote: Incorrect

```text
Student clicks "Incorrect" button
       ↓
Form appears:
┌─────────────────────────────┐
│ Failing Test Case Required  │
│ ┌───────────────────────────┤
│ │ Input: [          ]       │
│ │ Expected Output: [   ]    │
│ │ Notes (optional): [   ]   │
│ │ [Submit Vote] [Cancel]    │
│ └───────────────────────────┤
│ (Optional notes to help     │
│  other students)            │
└─────────────────────────────┘
       ↓
Student provides test case and clicks "Submit Vote"
       ↓
Frontend sends: POST /challenges/:id/peer-reviews/votes
{
  assignmentId: peerReviewAssignmentId,
  vote: 'incorrect',
  testCaseInput: "100 200",
  expectedOutput: "300",
  notes: "Doesn't handle large numbers correctly"
}
       ↓
Backend validates test case:

Step 1: Check not duplicate of public tests
  ├─ Compare input against all public test inputs
  ├─ Must be unique test case
  └─ if duplicate → return error

Step 2: Run against reviewed submission
  ├─ Execute student's code with provided input
  ├─ Get actual output
  ├─ if actual === expectedOutput:
  │    → error "Test passes on reviewed code"
  └─ Test must FAIL on reviewed code

Step 3: Run against reference solution
  ├─ Execute reference solution with provided input
  ├─ Get actual output
  ├─ if actual !== expectedOutput:
  │    → warning "Reference fails this test"
  │    → isValidated: false
  │    → failedReferenceCheck: true
  └─ else → isValidated: true

Result: PeerReviewVote created with validation flags
       ↓
Next assignment displayed
```

**Test Case Validation Details**:

```javascript
async function validateTestCase(testCaseInput, expectedOutput, reviewedCode, referenceSolution) {
  const errors = [];
  
  // 1. Check against public tests
  if (isDuplicateOfPublicTest(testCaseInput, publicTests)) {
    return {
      valid: false,
      reason: 'Test case is duplicate of public test'
    };
  }
  
  // 2. Run against reviewed submission
  const reviewedResult = await executeCode(reviewedCode, testCaseInput);
  
  if (reviewedResult.isCompiled && reviewedResult.output === expectedOutput) {
    return {
      valid: false,
      reason: 'Test passes on reviewed submission (should fail)'
    };
  }
  
  if (!reviewedResult.isCompiled) {
    // Code doesn't compile, test is valid
    return { valid: true, failedReferenceCheck: false };
  }
  
  // 3. Run against reference solution
  const refResult = await executeCode(referenceSolution, testCaseInput);
  
  if (!refResult.isCompiled) {
    return {
      valid: true,
      failedReferenceCheck: true,
      reason: 'Reference solution fails to compile (unusual)'
    };
  }
  
  if (refResult.output !== expectedOutput) {
    return {
      valid: true,
      failedReferenceCheck: true,
      reason: 'Test case fails on reference solution'
    };
  }
  
  // All checks passed
  return { valid: true, failedReferenceCheck: false };
}
```

#### Vote: Abstain

```text
Student clicks "Abstain" button
       ↓
Frontend sends: POST /challenges/:id/peer-reviews/votes
{
  assignmentId: peerReviewAssignmentId,
  vote: 'abstain'
}
       ↓
Backend creates PeerReviewVote:
{
  peerReviewAssignmentId,
  vote: 'abstain',
  submittedAt: NOW()
}
       ↓
Note: No test case required for abstain
Next assignment displayed
```

#### 5.4 Early Exit & Completion

**Student Completes Reviews**:

```text
Progress bar shows: 12/12 reviews completed
       ↓
Display: "All reviews complete! You can exit early or continue."
       ↓
Student clicks "Exit"
       ↓
System locks all votes for this student
       ↓
Redirect to results preview page
```

**Early Exit Benefits**:

- Frees up time for other activities
- Votes still count toward scoring
- Cannot re-enter once exited

#### 5.5 Automatic Peer Review End

**Timer Expires**:

```text
Countdown reaches 00:00
       ↓
Scheduler triggers: schedulePhaseTwoEnd()
       ↓
For each incomplete assignment:
├─ No vote submitted yet?
├─ Create abstain vote
└─ Lock from further changes
       ↓
Update Challenge:
status: 'ended_phase_two'
scoringStatus: 'computing'
       ↓
Trigger scoring calculation immediately
       ↓
Broadcast event: { event: 'peer-review-ended', challengeId }
```

---

### Phase 6: Scoring Phase

#### 6.1 Automatic Score Calculation

**System Flow**:

```text
Phase 2 Ends
       ↓
Update Challenge.scoringStatus = 'computing'
       ↓
Run comprehensive scoring algorithm:

Step 1: Validate all test cases
Step 2: Determine ground truth for each submission
Step 3: Calculate peer review scores
Step 4: Calculate coding phase scores
Step 5: Compute total scores
Step 6: Create score breakdowns
Step 7: Award badges
       ↓
Update Challenge:
status: 'completed'
scoringStatus: 'completed'
       ↓
Broadcast event: { event: 'challenge-completed', challengeId }
```

#### 6.2 Scoring Algorithm (RT-215 + RT-216)

#### Step 1: Test Case Validation

```javascript
// For each "incorrect" vote with a test case:
for (const vote of incorrectVotes) {
  const referenceResult = await executeCodeTests(
    referenceSolution,
    [vote.testCase]
  );
  
  if (!referenceResult.passed) {
    // This is an invalid test case
    vote.failedReferenceCheck = true;
  }
}
```

#### Step 2: Determine Ground Truth

```javascript
// For each submission, determine if it's truly correct
const submissionTruthMap = new Map();

for (const submission of allFinalSubmissions) {
  const groundTruth = {
    isCorrect: submission.passedPrivateTests === submission.totalPrivateTests,
    passedPrivateTests: submission.passedPrivateTests,
    totalPrivateTests: submission.totalPrivateTests,
    matchSettingId: submission.match.challengeMatchSettingId
  };
  
  submissionTruthMap.set(submission.id, groundTruth);
}
```

#### Step 3: Calculate Peer Review Scores

```javascript
// For each participant (as a reviewer):
for (const participant of participants) {
  const votes = await findAllVotesByReviewer(participant.id);
  
  let correctVotes = 0;
  let incorrectVotes = 0;
  let abstainVotes = 0;
  
  for (const vote of votes) {
    const groundTruth = submissionTruthMap.get(vote.submission.id);
    
    if (vote.vote === 'abstain') {
      abstainVotes++;
      continue;
    }
    
    // Check if vote matches ground truth
    const voteIsCorrect = 
      (vote.vote === 'correct' && groundTruth.isCorrect) ||
      (vote.vote === 'incorrect' && !groundTruth.isCorrect && !vote.failedReferenceCheck);
    
    if (voteIsCorrect) {
      correctVotes++;
    } else {
      incorrectVotes++;
    }
  }
  
  const totalVotes = correctVotes + incorrectVotes + abstainVotes;
  
  // Peer review score: percentage of accurate votes
  const peerReviewScore = totalVotes > 0 
    ? (correctVotes / totalVotes) * 100 
    : 0;
  
  // Valid range: 0-100
  scores.set(participant.id, {
    peerReviewScore: Math.min(100, Math.max(0, peerReviewScore)),
    correctVotes,
    incorrectVotes,
    abstainVotes
  });
}
```

#### Step 4: Calculate Coding Phase Scores

```javascript
// For each participant (as a coder):
for (const participant of participants) {
  const submission = participant.finalSubmission;
  
  if (!submission) {
    codingPhaseScore = 0;
    continue;
  }
  
  const passedRatio = submission.passedPrivateTests / submission.totalPrivateTests;
  const codingPhaseScore = passedRatio * 100; // 0-100 points
  
  scores.get(participant.id).codingPhaseScore = codingPhaseScore;
}
```

#### Step 5: Calculate Total Scores

```javascript
// Weighted combination (weights configurable per challenge)
const PEER_REVIEW_WEIGHT = 0.30; // 30%
const CODING_PHASE_WEIGHT = 0.70; // 70%

for (const [participantId, score] of scores) {
  const totalScore = 
    (score.peerReviewScore * PEER_REVIEW_WEIGHT) + 
    (score.codingPhaseScore * CODING_PHASE_WEIGHT);
  
  score.totalScore = totalScore; // 0-100
}
```

### Step 6: Save Score Breakdown

```javascript
for (const [participantId, score] of scores) {
  const received = await getReceivedVotes(submission.id);
  
  await SubmissionScoreBreakdown.create({
    challengeId,
    participantId,
    peerReviewScore: score.peerReviewScore,
    codingPhaseScore: score.codingPhaseScore,
    totalScore: score.totalScore,
    correctVotes: score.correctVotes,
    incorrectVotes: score.incorrectVotes,
    abstainVotes: score.abstainVotes,
    receivedCorrectVotes: received.correct,
    receivedIncorrectVotes: received.incorrect,
    assignmentsTotal: assignments.length,
    passedPrivateTests: submission.passedPrivateTests,
    totalPrivateTests: submission.totalPrivateTests
  });
}
```

#### 6.3 Badge Award System

**Challenge Milestone Badges**:

```javascript
// After scoring completes, award milestone badges
async function awardChallengeMilestoneBadges(studentId) {
  // Count total challenges completed by student
  const completedChallenges = await Challenge.count({
    where: {
      status: 'completed'
    },
    include: [{
      model: ChallengeParticipant,
      where: { studentId },
      required: true
    }]
  });
  
  // Find milestone badges that student qualifies for
  const eligibleBadges = await Badge.findAll({
    where: {
      category: 'CHALLENGE_MILESTONE',
      metric: 'CHALLENGES_COMPLETED',
      threshold: { [Op.lte]: completedChallenges }
    }
  });
  
  // Award newly unlocked badges
  const newBadges = [];
  for (const badge of eligibleBadges) {
    const [studentBadge, created] = await StudentBadge.findOrCreate({
      where: { studentId, badgeId: badge.id },
      defaults: { awardedAt: new Date() }
    });
    
    if (created) {
      newBadges.push({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        iconKey: badge.iconKey,
        level: badge.level
      });
    }
  }
  
  return newBadges; // Display to student
}
```

**Typical Badges**:

- "Novice Programmer": Completed 1 challenge
- "Emerging Developer": Completed 3 challenges
- "Consistent Coder": Completed 5 challenges
- "First Try Hero": Passed all tests on first submission
- "Speed Coder": Completed before half the time elapsed
- "Perfect Reviewer": 100% accurate peer reviews

#### 6.4 Score Calculation Guarantees

```text
Consistency Guarantees:
├─ Idempotent: Running calculation multiple times = same result
├─ Atomic: All-or-nothing, no partial updates
├─ Fair: No bias toward any participant
├─ Transparent: Clear breakdown of score components
├─ Auditable: All calculations logged
└─ Correct: Ground truth from private test results
```

---

### Phase 7: Results & Leaderboard

#### 7.1 Student Results View

**Student Access** (after scoring completes):

**Personal Score Breakdown**:

```text
┌─────────────────────────────────┐
│   Your Challenge Results        │
├─────────────────────────────────┤
│                                 │
│ Total Score: 87.5/100           │
│ ┌──────────────────────────────┐│
│ │ Coding Phase:        70/100  ││
│ │ Peer Review Accuracy: 95/100 ││
│ └──────────────────────────────┘│
│                                 │
│ Coding Results:                 │
│ ✓ Passed Private Tests: 7/7     │
│ ✓ Passed Public Tests:  3/3     │
│                                 │
│ Peer Review Activity:           │
│ ✓ Accuracy: 95%                 │
│ ├─ Correct Votes:  19/20        │
│ ├─ Incorrect Votes: 1/20        │
│ └─ Abstained: 0                 │
│                                 │
│ Your Submission:                │
│ [View Code] [Download]          │
│                                 │
└─────────────────────────────────┘
```

**Peer Review Feedback**:

```text
Your Solution Received:
├─ 18 "Correct" votes ✓
├─ 1 "Incorrect" vote with test case:
│  Input: "999999 999999"
│  Expected: overflow handling
└─ 1 Abstain
```

**Newly Earned Badges**:

```text
🎉 Congratulations!

You've earned new badges:
┌────────────────┐  ┌────────────────┐
│ 5-Challenge    │  │ Perfect        │
│ Streak         │  │ Reviewer       │
└────────────────┘  └────────────────┘

View your profile to see all achievements
```

#### 7.2 Teacher Results View

**Comprehensive Analytics**:

```text
Challenge: "Sum of Two Numbers" (Completed)

Overview:
├─ Participants: 24
├─ Completion Rate: 95.8% (23/24)
├─ Average Score: 78.2/100
├─ Median Score: 81.5/100
├─ Std Deviation: 14.3

Match Breakdown:
├─ Match 1 (6 students)
│  ├─ Valid Submissions: 6/6
│  ├─ Avg Score: 82.1
│  └─ Peer Reviews: 100% assigned
│
├─ Match 2 (6 students)
│  ├─ Valid Submissions: 5/6
│  ├─ Avg Score: 76.3
│  └─ Peer Reviews: 100% assigned
│
└─ Match 3 (6 students)
   ├─ Valid Submissions: 6/6
   ├─ Avg Score: 80.4
   └─ Peer Reviews: 100% assigned

Top Performers:
1. Alice Johnson  - 96.5/100
2. Bob Smith      - 94.2/100
3. Carol Davis    - 92.8/100
```

**Individual Student Performance**:

```text
Student: alice@example.com
├─ Submission Status: Valid ✓
├─ Final Submission Time: 45m 32s
├─ Coding Score: 100/100
├─ Peer Review Score: 93/100
│  ├─ Accuracy: 93% (14/15 votes correct)
│  └─ Total Votes: 15
├─ Total Score: 96.5/100
└─ Rank: 1/24
```

#### 7.3 Leaderboard API

```javascript
GET /challenges/:id/leaderboard

Response:
{
  challengeId: 42,
  totalParticipants: 24,
  leaderboard: [
    {
      rank: 1,
      studentId: 101,
      studentName: "Alice Johnson",
      username: "alice",
      totalScore: 96.5,
      codingScore: 100,
      peerReviewScore: 93,
      passedPrivateTests: 7,
      totalPrivateTests: 7,
      badges: ["FIRST_TRY_HERO", "CHALLENGE_STREAK_3"],
      currentTitle: "Specialist",
      titleColor: "cyan"
    },
    {
      rank: 2,
      studentId: 102,
      studentName: "Bob Smith",
      username: "bob",
      totalScore: 94.2,
      codingScore: 100,
      peerReviewScore: 88,
      passedPrivateTests: 7,
      totalPrivateTests: 7,
      badges: ["SPEED_CODER"],
      currentTitle: "Pupil",
      titleColor: "green"
    },
    // ... more entries
  ],
  stats: {
    averageScore: 78.2,
    medianScore: 81.5,
    minScore: 32.1,
    maxScore: 96.5
  }
}
```

---

## API Architecture

### REST API Endpoints

#### Authentication (Public)

```text
POST   /api/login                         # User login (email/password)
POST   /api/logout                        # User logout
GET    /api/session                       # Check session status
```

#### Challenge Management (Teacher Only)

```text
POST   /challenges                        # Create new challenge
GET    /challenges                        # List all challenges (teacher view)
GET    /challenges/:id                    # Get challenge details
PUT    /challenges/:id                    # Update challenge
DELETE /challenges/:id                    # Delete challenge
POST   /challenges/:id/start              # Start coding phase
POST   /challenges/:id/publish            # Publish (private → public)
```

#### Challenge Participants (Teacher)

```text
GET    /challenges/:id/participants       # List enrolled students
POST   /challenges/:id/assign             # Assign students to matches
GET    /challenges/:id/matches            # List match instances
```

#### Challenge Participation (Student)

```text
GET    /challenges/for-student            # List available challenges
POST   /challenges/:id/join               # Enroll in challenge
GET    /challenges/:id/for-student        # Get student's challenge view
GET    /challenges/:id/matchSetting       # Get problem for assigned match
GET    /challenges/:id/match              # Get match details
```

#### Code Execution (Student)

```text
POST   /run                               # Execute code with public tests
```

**Request**:

```json
{
  "code": "int main() { std::cout << 5 + 10; }",
  "language": "cpp",
  "testCases": [
    {"input": "5 10", "expectedOutput": "15"},
    {"input": "-3 7", "expectedOutput": "4"}
  ],
  "userId": 123
}
```

**Response**:

```json
{
  "isCompiled": true,
  "results": [
    {
      "input": "5 10",
      "expectedOutput": "15",
      "actualOutput": "15",
      "passed": true
    },
    {
      "input": "-3 7",
      "expectedOutput": "4",
      "actualOutput": "4",
      "passed": true
    }
  ],
  "compilationMessage": "Success"
}
```

#### Submissions (Student)

```text
POST   /submissions                       # Submit code solution
GET    /submissions/last                  # Get last submission
GET    /submission/:id                    # Get specific submission
```

#### Match Settings (Teacher)

```text
POST   /matchSettings                     # Create match setting
GET    /matchSettings                     # List all match settings
GET    /matchSettingsReady                # List validated match settings
GET    /matchSettings/:id                 # Get match setting details
PUT    /matchSettings/:id                 # Update match setting
DELETE /matchSettings/:id                 # Delete match setting
POST   /matchSettings/:id/validate        # Validate reference solution
```

#### Peer Review Management (Teacher)

```text
POST   /challenges/:id/peer-reviews/assign           # Assign reviews
POST   /challenges/:id/peer-reviews/start            # Start peer review
POST   /challenges/:id/peer-reviews/finalize         # Teacher finalize
```

#### Peer Review Participation (Student)

```text
GET    /challenges/:id/peer-reviews/assignments      # Get assignments
POST   /challenges/:id/peer-reviews/votes            # Submit vote
GET    /challenges/:id/peer-reviews/votes            # Get votes (display)
GET    /challenges/:id/peer-reviews/summary          # Summary stats
POST   /challenges/:id/peer-reviews/exit             # Exit early
```

#### Results & Scoring (All)

```text
GET    /challenges/:id/results                       # Student results
GET    /challenges/:id/teacher-results               # Teacher results
GET    /challenges/:id/leaderboard                   # Leaderboard
GET    /challenges/:id/scoring-status                # Scoring progress
POST   /challenges/:id/calculate-scores              # Manual trigger
```

#### Student Profile (Student)

```text
GET    /students/me/profile               # Get student profile
```

**Response**:

```json
{
  "user": {
    "id": 123,
    "username": "alice",
    "fullName": "Alice Johnson",
    "email": "alice@example.com",
    "titleId": 3
  },
  "title": {
    "name": "Specialist",
    "color": "cyan",
    "level": 3
  },
  "badges": [
    {"id": 1, "name": "First Try Hero", "iconKey": "hero"},
    {"id": 2, "name": "Challenge Streak 3", "iconKey": "streak3"}
  ],
  "stats": {
    "challengesCompleted": 12,
    "totalScore": 950.5,
    "averageScore": 79.2,
    "currentStreak": 3,
    "longestStreak": 7
  }
}
```

#### System Configuration (Teacher)

```text
GET    /rules                             # Get scoring rules
```

#### Real-Time Events (Server-Sent Events)

```text
GET    /events                            # SSE stream for live updates
```

**Event Examples**:

```javascript
// Event 1: Challenge status changed
{
  event: 'challenge-updated',
  data: {
    challengeId: 42,
    status: 'coding_phase',
    message: 'Coding phase has started'
  }
}

// Event 2: Phase started
{
  event: 'phase-started',
  data: {
    challengeId: 42,
    phase: 'peer_review_phase',
    durationMs: 1800000
  }
}

// Event 3: Phase ended
{
  event: 'phase-ended',
  data: {
    challengeId: 42,
    phase: 'coding_phase'
  }
}

// Event 4: Submission evaluated
{
  event: 'submission-evaluated',
  data: {
    submissionId: 5001,
    status: 'valid',
    passedPublicTests: 3,
    totalPublicTests: 3
  }
}
```

---

## Deployment Architecture

### Docker Compose Stack

**Service Topology**:

```text
docker-compose.yml
├─ backend (Node.js/Express)
│  ├─ Listens on 0.0.0.0:3001
│  ├─ Reverse proxies frontend
│  ├─ Proxies to redis (session + job queue)
│  ├─ Proxies to db (PostgreSQL)
│  └─ Uses docker socket for code execution
│
├─ frontend (Next.js)
│  ├─ Internal port 3000
│  ├─ Proxied by backend
│  └─ Not exposed directly
│
├─ db (PostgreSQL 16)
│  ├─ Port 5432 (internal only)
│  ├─ Persistent volume: postgres-data
│  └─ Sequelize migrations on startup
│
└─ redis (Redis 7)
   ├─ Port 6379 (internal only)
   ├─ Session store (express-session)
   └─ Job queue (BullMQ)
```

### Environment Configuration

**Backend .env**:

```bash
# Database Configuration
DB_HOST=db
DB_PORT=5432
DB_NAME=codymatch
DB_USER=admin
DB_PASSWORD=secure_password_here
DB_DIALECT=postgres

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379

# Session Configuration
SESSION_SECRET=random_very_long_secret_string_here
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false  # true in production

# Server Configuration
PORT=3001
NODE_ENV=development  # production in deployed
LOG_LEVEL=debug

# Code Execution
CODE_RUNNER_IMAGE=judge0/compilers:latest
CODE_RUNNER_TIMEOUT=10000  # milliseconds
CODE_RUNNER_MEMORY_LIMIT=512m
CODE_RUNNER_CPU_LIMIT=1

# CORS
CORS_ORIGIN=http://localhost:3001

# JWT (if used)
JWT_SECRET=optional_jwt_secret
JWT_EXPIRY=7d
```

**Frontend .env.local**:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=CodyMatch
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Orchestration Script

**codymatch.sh** (Docker Compose wrapper):

```bash
#!/bin/bash
# CodyMatch Development Orchestration

case "$1" in
  start|up)
    docker-compose up -d
    echo "Services starting..."
    docker-compose logs -f
    ;;
  stop|down)
    docker-compose down
    echo "Services stopped"
    ;;
  restart)
    docker-compose restart
    echo "Services restarted"
    ;;
  build)
    docker-compose build
    echo "Services built"
    ;;
  logs)
    docker-compose logs -f
    ;;
  logs-backend)
    docker-compose logs -f backend
    ;;
  logs-frontend)
    docker-compose logs -f frontend
    ;;
  bul)  # Build, Up, Logs (common development workflow)
    docker-compose build
    docker-compose up
    ;;
  psql)
    docker-compose exec db psql -U admin -d codymatch
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|build|logs|logs-backend|logs-frontend|bul|psql}"
    exit 1
    ;;
esac
```

---

## Security Implementation

### Authentication & Authorization

**Password Security**:

- bcrypt hashing with salt rounds = 10
- Never store plaintext passwords
- One-way function, cannot be reversed

**Session Management**:

- express-session with PostgreSQL store
- Secure session tokens stored in database
- HTTP-only cookies prevent XSS attacks
- Secure flag in production (HTTPS only)
- SameSite=Strict prevents CSRF

**Role-Based Access Control**:

```javascript
// Middleware checks user role
const requireTeacher = (req, res, next) => {
  if (req.session.user?.role !== 'teacher') {
    return res.status(403).json({ error: 'Teacher access required' });
  }
  next();
};

const requireStudent = (req, res, next) => {
  if (req.session.user?.role !== 'student') {
    return res.status(403).json({ error: 'Student access required' });
  }
  next();
};
```

### Code Execution Security

**Container Isolation**:

```text
Per-Execution Container
├─ Separate from host system
├─ No mount points to host
├─ No access to other containers
└─ Destroyed after execution
```

**Resource Limits**:

- CPU: Limited to 1 core
- Memory: Limited to 512MB
- Execution Time: 10 seconds max
- Disk I/O: No persistent disk access

**Network Isolation**:

- No internet access
- No access to other containers
- No access to host network
- Cannot spawn new processes outside sandbox

**Input Validation**:

- Test case inputs validated before execution
- Length limits enforced
- Dangerous patterns rejected (null bytes, etc.)
- Encoded safely before passing to container

### API Security

**Helmet.js Security Headers**:

```javascript
// Automatically set by Helmet:
X-Content-Type-Options: nosniff  // Prevent MIME sniffing
X-Frame-Options: DENY            // Prevent clickjacking
X-XSS-Protection: 1; mode=block  // Enable XSS filter
Content-Security-Policy: ...      // Restrict resource loading
Strict-Transport-Security: ...    // HTTPS only in production
```

**CORS Configuration**:

```javascript
cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  maxAge: 3600
})
```

**Request Validation**:

- All inputs validated with AJV JSON Schema
- Type checking enforced
- Length limits enforced
- Invalid data rejected with 400 Bad Request

**SQL Injection Prevention**:

- Sequelize ORM with parameterized queries
- No raw SQL in application code
- Proper escaping of values

**XSS Prevention**:

- React's built-in HTML escaping
- DOMPurify for user-generated HTML
- Content-Security-Policy headers
- No eval() or innerHTML usage

---

## Performance Optimizations

### Database

**Indexes**:

```sql
CREATE INDEX idx_challenge_status ON challenges(status);
CREATE INDEX idx_participant_challenge ON challenge_participants(challenge_id);
CREATE INDEX idx_submission_match ON submissions(match_id);
CREATE INDEX idx_peer_review_reviewer ON peer_review_assignments(reviewer_id);
CREATE INDEX idx_peer_review_submission ON peer_review_assignments(submission_id);
```

**Connection Pooling**:

- Sequelize pool max: 20 connections
- Min idle: 2 connections
- Idle timeout: 30 seconds

**Query Optimization**:

- Eager loading to prevent N+1 queries
- Selective field retrieval
- Pagination on all list endpoints

**Examples**:

```javascript
// Good: Eager load relationships
const challenge = await Challenge.findByPk(id, {
  include: [
    { model: Match, include: [Submission] },
    { model: ChallengeMatchSetting, include: [MatchSetting] }
  ]
});

// Bad: Lazy loading in loop (N+1)
for (const challenge of challenges) {
  const matches = await challenge.getMatches();  // Query per challenge!
}
```

### Code Execution

**Job Queue (BullMQ)**:

- Async processing of code execution
- Workers pick up jobs from Redis queue
- Multiple workers can process in parallel
- Retries on failure (3 attempts)
- Job timeout: 30 seconds

**Container Warm Pool**:

- Maintain pool of warm Judge0 containers
- Faster startup than cold start
- Reduces latency for code execution

**Result Caching**:

```javascript
// Same code + same test cases = cached result
const cacheKey = `${code_hash}:${testcases_hash}`;
const cached = await redis.get(cacheKey);
if (cached) return cached;
```

### Frontend

**Code Splitting**:

- Automatic by Next.js
- Each page is separate bundle
- Shared chunks extracted

**Monaco Editor**:

- Lazy loaded on demand
- ~2MB bundle, loaded after page interactive
- Syntax highlighting cached

**State Persistence**:

- Redux Persist to localStorage
- Survives page refresh
- Reduces API calls

**Image Optimization**:

- Next.js Image component
- Automatic format selection (WebP/AVIF)
- Responsive sizing

### Real-Time Updates

**Server-Sent Events (SSE)**:

- One-way streaming from server to client
- Lower overhead than WebSocket
- Built-in reconnection handling
- Auto-cleanup on disconnect

**Event Debouncing**:

```javascript
// Prevent excessive updates
const broadcastEvent = debounce((event) => {
  emitToClients(event);
}, 100); // Max 10 events/second
```

---

## Testing Strategy

### Backend Tests (Vitest)

**Unit Tests**:

```javascript
describe('Submission Service', () => {
  it('should mark submission as valid if all public tests pass', async () => {
    const submission = await createMockSubmission({
      passedPublicTests: 3,
      totalPublicTests: 3
    });
    
    const result = await validateSubmission(submission);
    
    expect(result.status).toBe('valid');
  });
});
```

**Integration Tests**:

```javascript
describe('Challenge API', () => {
  it('should create challenge with valid data', async () => {
    const response = await request(app)
      .post('/challenges')
      .send({
        title: 'Test Challenge',
        startDatetime: futureDate,
        durationCodingPhase: 60,
        matchSettingIds: [1, 2]
      })
      .expect(201);
    
    expect(response.body.status).toBe('private');
    expect(response.body.id).toBeDefined();
  });
});
```

**Test Coverage**:

- Controllers: 85%+ coverage
- Services: 90%+ coverage
- Models: 80%+ coverage
- Overall: 85%+ coverage

### Frontend Tests (Vitest + Testing Library)

**Component Tests**:

```javascript
describe('ChallengeList Component', () => {
  it('should display list of challenges', () => {
    const { getByText } = render(
      <ChallengeList challenges={mockChallenges} />
    );
    
    expect(getByText('Test Challenge')).toBeInTheDocument();
  });
});
```

**Hook Tests**:

```javascript
describe('useChallenge hook', () => {
  it('should fetch challenge data on mount', async () => {
    const { result } = renderHook(() => useChallenge(123));
    
    await waitFor(() => {
      expect(result.current.challenge).toBeDefined();
    });
  });
});
```

---

## Key Features Summary

### For Teachers ✅

- ✅ Create and validate reusable match settings (coding problems)
- ✅ Compose challenges from match settings
- ✅ Schedule challenges with publication automation
- ✅ Monitor real-time student enrollment
- ✅ Automatic fair match assignment
- ✅ Real-time coding phase monitoring
- ✅ Automatic peer review assignment
- ✅ Manual peer review finalization option
- ✅ View comprehensive scoring results
- ✅ Generate leaderboards
- ✅ Analytics dashboard with statistics
- ✅ Export results (planned)

### For Students ✅

- ✅ Browse available challenges by schedule
- ✅ Enroll in challenges
- ✅ Professional code editor (Monaco)
- ✅ Run code with instant public test feedback
- ✅ Submit solutions (tested against hidden tests)
- ✅ Multiple submission attempts allowed
- ✅ Participate in peer review
- ✅ Vote on solution correctness with validation
- ✅ Provide failing test cases
- ✅ View detailed score breakdown
- ✅ Earn badges and achievements
- ✅ Track skill tier progression
- ✅ View personal profile and statistics
- ✅ See challenge leaderboard

### System Features ✅

- ✅ Multi-language code support (C++, Python, Java, JavaScript)
- ✅ Public and private test cases
- ✅ Docker-based isolated code execution
- ✅ Session-based authentication
- ✅ Real-time updates via SSE
- ✅ Automated phase scheduling with BullMQ
- ✅ Sophisticated scoring algorithm
- ✅ Gamification with badges
- ✅ Skill tier system
- ✅ Leaderboard generation
- ✅ Comprehensive logging (Winston)
- ✅ Database migrations (Umzug)
- ✅ Test coverage
- ✅ Docker containerization
- ✅ GitHub Actions CI/CD

---

## Future Enhancements

### Planned Features

**Gamification Extensions**:

- Shop system with power-ups
- Team/clan competitions
- Monthly/seasonal leaderboards
- Achievement unlocks
- Points redeemable for features

**Learning Features**:

- Solution explanation videos
- Code review comments (inline)
- Discussion forums per challenge
- Plagiarism detection

**Advanced Competition**:

- Live coding tournaments (bracket style)
- 1v1 quick matches
- Team challenges
- Difficulty ratings per problem

**Analytics**:

- Advanced teacher dashboard
- Student progress tracking
- Time-to-solve analytics
- Difficulty analysis

**Platform**:

- Mobile app (React Native)
- API for third-party integration
- IDE plugin (VS Code extension)
- Cli tool for local testing

### Technical Improvements

- Microservices architecture
- Kubernetes orchestration
- GraphQL API alternative
- WebSocket for bidirectional communication
- Redis caching layer
- CDN for static assets

---

## Terminology

### Challenge

A timed competition containing one or more match settings. Teachers create and schedule challenges. Students enroll, compete, review, and receive scores. Status progresses through: private → public → assigned → coding_phase → peer_review_phase → scoring_phase → completed.

### Match Setting

A reusable problem template defining a coding problem with test cases and reference solution. Teachers validate match settings before use. Can be used in multiple challenges.

### Match

An instance of a match setting within a specific challenge, assigned to a subset of students. Multiple matches of the same match setting can exist in one challenge to accommodate all students.

### Public Test

A test case visible to students. Shows both input and expected output. Students see results when running or submitting code. Used for immediate feedback.

### Private Test

A hidden test case unknown to students. Only the system and teacher know the input and output. Used for final evaluation and scoring. Determines "ground truth" for peer review accuracy.

### Valid Submission

A submission that passed all public test cases. Only valid submissions are eligible for peer review. At least one valid submission per participant is required for peer review assignment.

### Final Submission

The last valid submission a student made during the coding phase. This is what gets peer reviewed and scored. Automatically determined as most recent valid submission, or auto-submitted at phase end.

### Peer Review Assignment

A task assigning a specific student to review a specific submission. Ensures fair workload distribution across all participants.

### Ground Truth

The actual correctness of a submission based on private test results. Determined during scoring phase. Used to evaluate peer review accuracy—"Did the reviewer correctly identify if the code was correct?"

### Extra Review

A peer review assignment beyond the base requirement. Marked for potential bonus point consideration. Ensures all submissions get reviewed even with uneven numbers.

---

## Team & Contact Information

**Development Team**: Capstone Red Team  
**Product Owner**: Sepideh Mottaghi (@SepidehMot)  
**Scrum Master**: Delaram Doroudgarian (@DelaramDoroud)  

**Project Links**:

- GitHub: [https://github.com/DelaramDoroud/Red-team](https://github.com/DelaramDoroud/Red-team)
- Jira: [https://capstone-red-team.atlassian.net/jira/software/projects/RT](https://capstone-red-team.atlassian.net/jira/software/projects/RT)
- Confluence: [https://capstone-red-team.atlassian.net/wiki/spaces/RED](https://capstone-red-team.atlassian.net/wiki/spaces/RED)

---

## Codebase Architecture and Implementation

### Backend Directory Structure

```text
backend/
├── app.js                          # Express HTTP server setup, port 3001
├── app_initial.js                  # Server initialization, middleware setup
├── dev.Dockerfile                  # Development container configuration
├── Dockerfile                       # Production container configuration
├── docker-entrypoint.sh             # Container startup script
├── eslint.config.js                 # ESLint configuration
├── migrator.js                      # Database migration runner
├── package.json                     # Dependencies and scripts
├── vitest.config.js                 # Test runner configuration
├── vitest.setup.js                  # Test environment setup
├── config/
│   ├── config.js                   # General configuration (port, env, etc.)
│   └── database.js                 # Sequelize ORM configuration
├── log/                             # Application logs directory
├── migrations/                      # Database schema migrations (30+)
├── models/                          # Sequelize data models (16+)
├── routes/                          # Express route handlers (9+ controllers)
├── schemas/                         # JSON schemas for validation (AJV)
├── scripts/                         # Utility scripts
├── services/                        # Business logic services (12+)
└── tests/                           # Test suites (25+ test files)
```

### Frontend Directory Structure

```text
frontend/
├── app/                             # Next.js app directory (13+ pages)
│   ├── challenges/
│   ├── match-settings/
│   ├── student/
│   ├── new-challenge/
│   └── layout.jsx
├── assets/
│   ├── components/                  # Reusable UI components
│   ├── modules/                     # Feature-specific modules
│   ├── css/                         # Global styles
│   ├── js/                          # Custom hooks and utilities
│   ├── img/                         # Image assets
│   └── constants/                   # Configuration constants
├── services/                        # API client services
├── package.json                     # Dependencies and scripts
├── next.config.js                   # Next.js configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── postcss.config.js                # PostCSS configuration
└── vitest.config.js                 # Frontend test configuration
```

### Database Architecture

**PostgreSQL 16 Configuration:**

- **Connection Pool**: max 15 connections, min 2 idle
- **ORM**: Sequelize 6.37 with underscored naming convention
- **Schema Naming**: JavaScript camelCase → Database snake_case
- **Timestamps**: All models include created_at, updated_at (auto-managed by Sequelize)
- **Constraints**: Foreign keys use CASCADE DELETE, unique constraints on composite keys
- **Indexes**: All foreign keys indexed, composite unique constraints indexed

**Database Models (16 entities):**

| Model | Purpose | Key Fields | Relations |
| ------- | --------- | ----------- | ----------- |
| `Challenge` | Coding problem/challenge | status, duration, title, description, max_participants | HasMany: Participant, Match, SubmissionScore |
| `ChallengeParticipant` | Student enrollment | challenge_id, user_id, role (student/teacher) | BelongsTo: Challenge, User; HasMany: Submission |
| `MatchSetting` | Problem variant/version | problem_id, reference_solution, public_tests, private_tests | BelongsTo: Challenge; HasMany: Match |
| `Match` | Student pairing for peer review | challenge_match_setting_id, student_id | BelongsTo: MatchSetting, ChallengeParticipant; HasMany: Submission |
| `Submission` | Student code submission | match_id, code, public_test_results, private_test_results, status | BelongsTo: Match; HasMany: PeerReviewAssignment, PeerReviewVote |
| `PeerReviewAssignment` | Peer reviewer assignment | submission_id, reviewer_id, is_extra | BelongsTo: Submission, ChallengeParticipant |
| `PeerReviewVote` | Reviewer feedback on submission | peer_review_assignment_id, score, feedback | BelongsTo: PeerReviewAssignment |
| `User` | Application user | email, role, name, student_id | HasMany: ChallengeParticipant |
| `Badge` | Achievement definition | name, icon, criteria | HasMany: StudentBadge |
| `StudentBadge` | Badge earned by student | badge_id, user_id, earned_at | BelongsTo: Badge, User |
| `Title` | Skill tier (Newbie→Grandmaster) | name, tier_level, required_points | BelongsTo: User |
| `PeerReviewVoteOption` | Allowed vote values | value, label | Referenced by PeerReviewVote |
| `SubmissionScore` | Scoring breakdown | submission_id, score_type, value | BelongsTo: Submission |

---

## Code Organization & Patterns

### Service Layer (Business Logic)

**Core Services in `/backend/services/`:**

1. **code-runner.js** (295 lines)
   - Purpose: Execute student code in isolated Docker containers
   - Key Functions:
     - `runCode(languageId, code, tests)`: Spawns Docker container via Judge0
   - Language Support: C++, Python, Java, JavaScript, C
   - Resource Limits: 128MB memory, network disabled, time limit per language
   - Container Management: Uses cidfile for tracking, manual cleanup on timeout
   - Integration: Called by execute-code-tests.js

2. **code-execution-queue.js** (150 lines)
   - Purpose: PostgreSQL-backed job queue for asynchronous code execution
   - Job Queue Provider: PgBoss (not BullMQ)
   - Key Functions:
     - `enqueueCodeExecution(jobData)`: Creates new job with priority
     - `getJobStatus(jobId)`: Polls job state (queued, processing, completed)
   - State Mapping: created → queued, active → processing, completed/failed → done
   - Job Retention: 15 minutes (default), 30 minutes (archived)
   - Retry Strategy: 3 attempts, 2000ms initial delay, exponential backoff
   - Schema: pgboss (dedicated PostgreSQL schema for job metadata)
   - Integration: Consumer by execute-code-tests.js

3. **execute-code-tests.js** (270 lines)
   - Purpose: Orchestrate test execution against code submission
   - Key Functions:
     - `executeCodeTests(submission, matchSetting)`: Main orchestration
   - Execution Flow:
     1. Parse test cases from MatchSetting.public_tests
     2. Wrap code if language has wrapper template
     3. Enqueue job for each test case via code-execution-queue
     4. Poll for results (500ms interval, 30 second max timeout)
     5. Aggregate results preserving test index
   - Error Handling: Compilation errors, runtime errors, timeouts
   - Return Value: Aggregated results object with per-test status
   - Integration: Called from run-controller.js

4. **assign-matches.js** (150+ lines)
   - Purpose: Assign students to match pairs for peer review
   - Algorithm:
     1. `shuffle()`: Randomize participant order
     2. Round-robin: Cycle through match settings
     3. Pair students: One pair per match slot
     4. Bulk insert: Create matches via Sequelize.bulkCreate()
   - Features:
     - Detects existing assignments (prevent duplicates)
     - Supports overwrite mode to reassign
     - Transactional: Uses sequelize.transaction() for atomicity
     - Returns grouped result by ChallengeMatchSetting
   - Called From: challenge-controller.js POST /challenges/:id/assign

5. **start-challenge.js** (120 lines)
   - Purpose: Transition challenge from ASSIGNED to STARTED_PHASE_ONE
   - Validation:
     - Check status = ASSIGNED
     - Verify participants exist
     - Verify matches created
   - Execution:
     - Calculate endPhaseOneDateTime = startedAt + (duration*60*1000 + 5000ms grace)
     - Update Challenge.status = STARTED_PHASE_ONE
     - Schedule phase completion check
   - Called From: challenge-controller.js POST /challenges/:id/start

6. **start-peer-review.js** (200 lines)
   - Purpose: Transition challenge to STARTED_PHASE_TWO for peer review
   - Validation:
     - Check Challenge.status = ENDED_PHASE_ONE
     - Verify phase-one-finalization completed
     - Count valid submissions per MatchSetting (IMPROVABLE or PROBABLY_CORRECT)
     - Require: >1 valid submission per match setting
   - Execution:
     - Create peer review assignments via assign-peer-reviews.js
     - Update Challenge.status = STARTED_PHASE_TWO
   - Called From: challenge-controller.js (automatic after phase one)

7. **assign-peer-reviews.js** (419 lines)
   - Purpose: Assign peer reviewers using max-flow matching algorithm
   - Algorithm: Bipartite graph matching
     1. Build bipartite graph: submissions (left) ↔ reviewers (right)
     2. Each reviewer must review other submissions (not own)
     3. Max edges: reviewersPerSubmission (typically 2-3)
     4. Uses maximum matching to ensure fair distribution
   - Output: PeerReviewAssignment records created
   - Features:
     - Prevents self-review (submission creator can't review own)
     - Distributes workload evenly
     - Handles edge cases (odd number of participants)
   - Called From: start-peer-review.js

8. **phase-one-finalization.js** (157 lines)
   - Purpose: Auto-finalize phase one submissions at timeout
   - Mechanism:
     - Map-based tracking of in-flight submissions per challenge
     - Timer scheduling for completion check (20s grace period in prod, 0s in test)
     - Auto-submit: Last compiled submission or empty submission
   - Execution:
     1. Detect submissions still being edited after grace period
     2. Finalize them (isFinal = true, mark auto-submit)
     3. Trigger phase completion checks
   - Grace Period: PHASE_ONE_AUTOSUBMIT_GRACE_MS = 20000ms (production)
   - Called From: start-challenge.js (scheduled on phase start)

9. **submission-evaluation.js** (30 lines)
   - Purpose: Determine submission status based on test results
   - Status Classification:
     - WRONG: <50% public tests pass
     - IMPROVABLE: ≥50% public tests pass but not all
     - PROBABLY_CORRECT: All public tests pass
   - Used For: Peer review eligibility determination
   - Called From: run-controller.js

10. **validator.js** (106 lines)
    - Purpose: JSON Schema validation for all API inputs
    - Framework: AJV (JSON Schema validator)
    - Configuration:
      - allErrors: Collect all validation errors
      - removeAdditional: Strip unknown fields
      - useDefaults: Apply default values from schema
    - Custom Keywords:
      - greaterThanField: Validate field1 > field2
      - greaterOrEqualThanField: Validate field1 >= field2
    - Schema Loading: Load from backend/schemas/*.json
    - Per-Request Lookup: Validators cached by schema key
    - Called From: All route handlers via validate middleware

11. **error.js** (50 lines)
    - Purpose: Centralized error handling and classification
    - Error Types:
      - ValidationError: Input validation failed
      - NotFoundError: Resource not found
      - UnauthorizedError: Authentication/authorization failed
      - BadRequest: General bad request
      - ServerError: Internal error
    - Function: `handleException(res, error)` returns consistent response
    - Features:
      - Stack trace included in dev environment only
      - Error messages translated to user-friendly format
    - Called From: Route error handlers

12. **logger.js** (30 lines)
    - Purpose: Structured logging throughout application
    - Framework: Winston logger
    - Configuration:
      - Console transport with color formatting
      - Log Levels: debug (dev/test), info (production), error (all)
    - Usage: logger.info(), logger.debug(), logger.error()
    - Called From: All major functions (setup, routes, services)

### API Route Handlers (Controllers)

**Main Routes Registered in `/backend/routes/index.js`:**

```javascript
app.use('/api', userRouter)           // Authentication endpoints
app.use('/api', configRouter)         // Configuration endpoints
app.use('/api/rest', challengeRouter) // Challenge CRUD
app.use('/api/rest', matchSettingRouter) // MatchSetting CRUD
app.use('/api/rest', submissionRouter) // Submission operations
app.use('/api/rest', runRouter)        // Code execution endpoint
app.use('/api/rest', peerReviewRouter) // Peer review operations
app.use('/api/rest', profileRouter)   // Student profiles
app.use('/api/rest', rewardRouter)    // Scoring rules (gamification)
app.use('/api/rest', schemaRouter)    // Schema definitions
app.use('/api/rest', eventsRouter)    // Server-sent events
```

**challenge-controller.js** (3,530 lines) - Core challenge management:

| Endpoint | Method | Purpose | Key Logic |
| ---------- | -------- | --------- | ----------- |
| `/challenges` | GET | List all challenges | Calculate totalMatches, finalSubmissionCount, resultsReady status |
| `/challenges/for-student` | GET | Student challenges | Filter by enrollment, hide results until ENDED_PHASE_TWO |
| `/challenges/:id` | GET | Challenge detail | Return with participant count and status |
| `/challenges` | POST | Create challenge | Validate time window, check no overlaps (unless allowOverlap=true) |
| `/challenges/:id` | PUT | Update challenge | Edit title, description, duration |
| `/challenges/:id/join` | POST | Student enrollment | Add ChallengeParticipant, broadcast event |
| `/challenges/:id/participants` | GET | Enrolled students | List with filtering options |
| `/challenges/:id/assign` | POST | Assign matches | Call assignMatches() service |
| `/challenges/:id/start` | POST | Start challenge | Call startChallenge() service |
| `/challenges/:id/results` | GET | View results | Only after ENDED_PHASE_TWO status |
| **+ 20+ peer review endpoints** | - | Phase 2 operations | Manage assignments, votes, finalization |

**run-controller.js** (130 lines) - Code execution endpoint:

```javascript
POST /run
{
  code: "string",
  language: "string", 
  matchSettingId: "integer"
}
```

- **Execution Flow**:
  1. Validate imports (block external libraries)
  2. Get MatchSetting with test cases
  3. Call executeCodeTests(submission, matchSetting)
  4. Evaluate submission status via submission-evaluation.js
  5. Return compiled status, test results, summary

- **Response**:

```json
{
  "compiled": true,
  "testResults": [
    { "input": "...", "expected": "...", "actual": "...", "passed": true }
  ],
  "summary": { "passed": 3, "total": 5 }
}
```

**submission-controller.js** - Submission management:

- GET `/submissions/:id` - Retrieve submission
- POST `/submissions` - Create submission
- PUT `/submissions/:id` - Update submission code
- DELETE `/submissions/:id` - Delete submission

**peer-review-controller.js** - Peer review operations:

- POST `/peer-reviews/assignments` - Create assignments
- GET `/peer-reviews/assignments/:id` - Get assignment
- POST `/peer-reviews/votes` - Submit vote/feedback
- PUT `/peer-reviews/:id/exit` - Early exit from review
- POST `/peer-reviews/finalize` - Complete review phase

**match-setting-controller.js** - Problem management:

- GET `/match-settings` - List problems
- POST `/match-settings` - Create problem
- PUT `/match-settings/:id` - Update problem
- DELETE `/match-settings/:id` - Delete problem

**profile-controller.js** - Student profiles:

- GET `/profile/:userId` - User profile with badges, titles, stats
- PUT `/profile/:userId` - Update profile
- GET `/leaderboard` - Global rankings

**reward-controller.js** - Scoring rules:

- GET `/rules` - List scoring rules
- POST `/rules` - Create rule
- PUT `/rules/:id` - Update rule
- DELETE `/rules/:id` - Delete rule

**events-controller.js** - Real-time updates:

- GET `/events` - Server-sent events stream
- Event types: participant-joined, assignment-created, vote-submitted, etc.

### Data Models

**Key Model Relationships:**

```text
Challenge (1) ──→ (M) ChallengeParticipant
       ├──→ (M) MatchSetting
       ├──→ (M) Match
       └──→ (M) SubmissionScore

MatchSetting (1) ──→ (M) Match
                    └──→ (M) Submission

Match (1) ──→ (M) Submission

Submission (1) ──→ (M) PeerReviewAssignment
              └──→ (M) PeerReviewVote

ChallengeParticipant (1) ──→ (M) PeerReviewAssignment
                        └──→ (M) PeerReviewVote

User (1) ──→ (M) ChallengeParticipant
       ├──→ (M) StudentBadge
       └──→ (1) Title
```

**Model Definitions Located in `/backend/models/`:**

Each model file (e.g., challenge.js) contains:

- Data type definitions (STRING, INTEGER, TEXT, JSON, etc.)
- Constraints (NOT NULL, UNIQUE, DEFAULT values)
- Indexes (on foreign keys and composite keys)
- Relationships (hasMany, belongsTo, hasOne)
- Hooks (beforeCreate, afterUpdate, etc.)
- Instance methods (helpers for business logic)
- Class methods (static queries)

Example Model Structure:

```javascript
// challenge.js
class Challenge extends Model {
  static STATUS_ENUM = ['PRIVATE', 'PUBLIC', 'ASSIGNED', 'STARTED_PHASE_ONE', 
                        'ENDED_PHASE_ONE', 'STARTED_PHASE_TWO', 'ENDED_PHASE_TWO']
  
  static init(sequelize) {
    super.init({
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: DataTypes.ENUM(...STATUS_ENUM),
      duration: DataTypes.INTEGER,  // minutes
      startedAt: DataTypes.DATE,
      endPhaseOneDateTime: DataTypes.DATE,
      // ... more fields
    }, { sequelize })
  }
  
  static associate(models) {
    this.hasMany(models.ChallengeParticipant, { foreignKey: 'challenge_id' })
    this.hasMany(models.MatchSetting, { foreignKey: 'challenge_id' })
    // ... more associations
  }
}
```

---

## Key Implementation Details

### Code Execution Pipeline

**End-to-End Flow:**

```text
Student Code Submission (run-controller.js)
    ↓
executeCodeTests() service
    ↓
For each test case:
    1. Wrap code if language has wrapper
    2. Enqueue job → code-execution-queue.js
    3. Poll job status (500ms interval, 30s max)
    ↓
code-runner.js (for each test):
    1. Spawn Docker container
    2. Copy code + test files
    3. Execute with timeout
    4. Capture output
    5. Compare with expected output
    6. Return result (pass/fail/timeout/error)
    ↓
Aggregate results → Evaluation
    ↓
Return to client with:
    - Compiled: true/false
    - Test results array
    - Summary (passed/total)
```

**Configuration:**

- **Docker Image**: Judge0 compilers
- **Language Timeouts**: 10s (Python/JS), 15s (C++/C), 20s (Java)
- **Memory Limit**: 128MB
- **Network**: Disabled (isolated execution)
- **Job Polling**: 500ms interval, 30 second max
- **Queue**: PgBoss with PostgreSQL backend

### Database Connection & Management

**Configuration (config/database.js):**

```javascript
{
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  pool: { max: 15, min: 2 },
  underscored: true,
  logging: process.env.NODE_ENV === 'development' ? console.log : false
}
```

**Model Initialization:**

- All models loaded in app_initial.js
- Relationships defined via Model.associate()
- Database sync (or migrations) on startup
- Connection pooling managed automatically

### Validation Pipeline

**Validation Flow:**

```text
HTTP Request
    ↓
Express middleware: validate(schema)
    ↓
validator.js:
    1. Get AJV validator for schema key
    2. Validate request body against JSON schema
    3. Return { valid: true/false, errors: [...] }
    ↓
If invalid: Return 400 with error details
If valid: Pass to route handler
    ↓
Route handler processes request
```

**Schema Files (backend/schemas/):**

- challenge-create.json - Validate POST /challenges
- submission-create.json - Validate POST /submissions
- peer-review-vote.json - Validate vote submission
- Custom keywords: greaterThanField, greaterOrEqualThanField

### Error Handling Strategy

**Centralized Error Response:**

```javascript
// error.js
handleException(res, error) {
  const response = {
    error: error.type || 'ServerError',
    message: error.message,
    timestamp: new Date(),
    statusCode: error.statusCode || 500
  }
  
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack  // Dev only
  }
  
  return res.status(response.statusCode).json(response)
}
```

**Error Classification:**

- **ValidationError** (400): Input validation failed
- **NotFoundError** (404): Resource not found
- **UnauthorizedError** (401): Auth required/invalid
- **BadRequest** (400): Generic client error
- **ServerError** (500): Unhandled internal error

### Logging Implementation

**Winston Logger Setup (logger.js):**

```javascript
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.colorize()
    })
  ]
})
```

**Usage Throughout:**

- app_initial.js: Startup logging
- Services: Business logic tracking
- Routes: Request/response logging (Morgan for HTTP)
- Error handling: Exception logging

### Testing Infrastructure

**Test Files in `/backend/tests/`:**

| File | Purpose | Coverage |
| ------ | --------- | ---------- |
| challenge.test.js | Challenge CRUD + lifecycle | Create, update, delete, status transitions |
| submission.test.js | Submission creation/evaluation | Create submission, check status |
| code-runner.test.js | Docker execution testing | Code compilation, output capture |
| code-runner-api.test.js | Judge0 API integration | API requests and responses |
| run-controller.test.js | /run endpoint | Code execution via HTTP |
| peer-review-assignments.test.js | Assignment algorithm | Max-flow matching |
| peer-review-vote.test.js | Voting mechanics | Vote submission, scoring |
| peer-review-exit.test.js | Early exit | Participant withdrawal |
| peer-review-finalization.test.js | Phase completion | Phase transition logic |
| submission-finalization.test.js | Auto-submit logic | Grace period, timeout handling |
| challenge-completed-badge.test.js | Badge awarding | Achievement system |
| leaderboard.test.js | Score ranking | Leaderboard calculation |
| Integration tests | Full workflows | End-to-end phase transitions |

**Test Configuration (vitest.config.js):**

- Test runner: Vitest
- Environment: Node
- Setup file: vitest.setup.js (database setup, test data)
- Coverage: All services, controllers, models

**Test Database:**

- Separate PostgreSQL database for testing
- Migrations run before test suite
- Data cleared between tests via beforeEach/afterEach

### Frontend Architecture (Next.js)

**App Directory Structure:**

- **Server Components**: Layout pages that fetch data server-side
- **Client Components**: Pages with `'use client'` directive for interactivity
- **Dynamic Routes**: [id] folders for parameterized pages
- **API Routes**: Typically handled via backend (not used here)

**Key Pages:**

- `/challenges` - List all challenges
- `/challenges/[id]` - Challenge detail with modules
- `/student` - Student dashboard
- `/match-settings` - Problem management
- `/new-challenge` - Create challenge form
- `/login` - Authentication page

**Frontend Components:**

- Reusable UI components in `assets/components/`
- Feature modules in `assets/modules/` (challenge-specific logic)
- Custom hooks in `assets/js/` (useRoleGuard for auth)
- Global styles in `assets/css/`

**State Management:**

- Redux Toolkit for global state
- Redux Persist for localStorage persistence
- Per-feature slices (challenge, user, etc.)
- Async thunks for API calls

**API Integration:**

- Frontend services in `services/` for HTTP calls
- Fetch API with error handling
- Axios or native fetch for requests

### Performance Optimizationss

**Backend Performance:**

1. **Connection Pooling**: Max 15 PostgreSQL connections, min 2 idle
2. **Query Optimization**: Indexes on foreign keys and composite keys
3. **Job Queue**: Async code execution via PgBoss, non-blocking
4. **Caching**: (if configured) Redis for session/ephemeral data
5. **Pagination**: List endpoints paginate large result sets

**Frontend Performance:**

1. **Code Splitting**: Next.js automatic page-based splitting
2. **Lazy Loading**: Components loaded on-demand
3. **Image Optimization**: Next.js image optimization
4. **State Persistence**: Redux Persist avoids re-fetching on page reload
5. **Request Deduplication**: Same API calls merged automatically

**Code Execution Performance:**

1. **Resource Limits**: 128MB memory per container prevents DoS
2. **Timeout Limits**: Per-language timeouts prevent infinite loops
3. **Container Reuse**: (if Judge0 configured) Reuse containers for efficiency
4. **Batch Job Processing**: PgBoss handles job distribution

### Security Considerations

**Input Validation:**

- All user inputs validated against JSON schemas (AJV)
- Custom keywords for field comparisons (greaterThanField)
- Additional fields stripped (removeAdditional)

**Code Execution Isolation:**

- Docker containers with network disabled
- Separate filesystem for each execution
- Resource limits prevent resource exhaustion
- No access to host system

**Authentication/Authorization:**

- Role-based access control (student, teacher, admin)
- useRoleGuard hook in frontend for page protection
- Route protection in controllers

**Error Handling:**

- Sensitive information not leaked in error messages
- Stack traces only in development environment
- Consistent error response format prevents information leakage

### Database Migrations

**Migration Files (backend/migrations/):**
Each migration file numbered by timestamp:

- 20251116222827-create-challenge-table.js
- 20251120130000-add-match-settings.js
- 20251120140000-create-user-table.js
- 20251205201823-create-submission-table.js
- ... (30+ migrations)

**Migration Pattern:**

```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create table/add column/modify schema
    await queryInterface.createTable('challenges', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      // ... columns
    })
  },
  async down(queryInterface, Sequelize) {
    // Rollback changes
    await queryInterface.dropTable('challenges')
  }
}
```

**Migration Runner (migrator.js):**

- Executed on application startup
- Tracks applied migrations in sequelizemeta table
- Automatic or manual trigger based on configuration

---

**Last Updated**: February 6, 2026  
**Document Version**: 1.0  
**Status**: Active Development (Sprint 3)
