// As discussed in class, each of the next four lessons will focus on one of the areas I presented. You can select the area that interests you most.

// You will then contact the other volunteers in that area to coordinate and distribute the topics.

// On the day of the flipped classroom, we expect each of you to present some information/insights that are not included in the required resources or were not discussed during my lesson, in no more than 10 minutes each. We will then have a plenary discussion, with all students participating, in which we assume that you, as the most knowledgeable on the topic, will have a leading role.

// The Foundations - Tuesday, 30/9/25
  // Definition of user story
  // Their role in agile development
  // TODO: add themes
  // TODO: big user stories = epics
  // TODO: feature is similar to epics, but more customer-centric
  // TODO: some features are bigger than epics and viceversa
  // User roles/personas
  // Good/bad examples
    // The acronym “INVEST” can remind you that good stories are:
      // I - Independent
      // N - Negotiable
      // V - Valuable
      // E - Estimable
      // S - Small
      // T - Testable
    // SMART Tasks
      // S - Specific
      // M - Measurable
      // A - Achievable
      // R - Relevant
      // T - Time-boxed



// ========== MANDATORY MATERIALS ==========

// User Stories Fundamentals
// https://www.atlassian.com/agile/project-management/user-stories
// https://agilemodeling.com/artifacts/userStory.htm

// Video: What is a user story
// YouTube video explaining the basics of user stories

// The 3 C's Framework (Card, Conversation, Confirmation)
// https://ronjeffries.com/xprog/articles/expcardconversationconfirmation/

// INVEST Criteria for Good Stories
// https://xp123.com/invest-in-good-stories-and-smart-tasks/

// Story Points and Estimation
// https://www.mountaingoatsoftware.com/blog/what-are-story-points

// Video: Planning Poker
// YouTube video about planning poker estimation technique

// Agile Prioritization
// https://www.6sigma.us/project-management/agile-prioritization-matrix/

// Behavior-Driven Development (BDD) and Gherkin
// https://www.browserstack.com/guide/gherkin-and-its-role-bdd-scenarios

// ========== OTHER INTERESTING MATERIALS ==========

// Mike Cohn on User Stories
// Video: "The role of a Scrum Master, the secrets to writing better user stories, with Mike Cohn"
// YouTube video with Mike Cohn on how to write better user stories

// Story Maps
// https://www.youtube.com/watch?v=f5WgaGZ_kT8
// https://www.easyagile.com/blog/the-ultimate-guide-to-user-story-maps/

// Personas
// https://userpilot.com/blog/how-to-create-a-persona/

// Behavior-Driven Development (Extended)
// https://cucumber.io/docs/bdd/
// https://cucumber.io/docs/bdd/discovery-workshop/ - "Toward a shared understanding of a user story meaning"

// Reflections on the 3 C's
// https://www.agileambition.com/Essays/3-C-Of-User-Story

// ========================================================================
// 10-MINUTE FLIPPED CLASSROOM PRESENTATION: USER STORIES FOUNDATIONS
// ========================================================================

#import "@preview/polylux:0.4.0": *

// Theme ------------------------------------------------------
#let accent = rgb(0x1e, 0x8e, 0x3e)
#let my-stroke = stroke(thickness: 2pt, paint: rgb(0xd4, 0xaf, 0x37), cap: "round")

// Global text style: readable sans with fallbacks
#show link: set text(accent.darken(45%))
#set text(font: ("Liberation Sans", "DejaVu Sans", "Noto Sans", "Open Sans", "Roboto"), size: 24pt)

#set page(
  width: 16in,
  height: 9in,
  margin: 2cm,
  footer: [
    #set text(size: .6em)
    #set align(horizon)
    #text(fill: luma(45%))[CP Course - Flipped Classroom]
    #h(1fr)
    #toolbox.slide-number
  ],
  header: box(stroke: (bottom: my-stroke), inset: 8pt)[
    #set text(size: .6em)
    #set align(horizon)
    #text(fill: accent.darken(45%))[User Stories Foundations]
    #h(1fr)
  ],
)

// Heading and list rhythm
// Darker titles for stronger contrast
#show heading: set text(fill: accent.darken(45%), weight: "bold")
// Unified spacing after titles/headings
#let title-gap = 20pt
// Add more space under headings for clearer separation from content
#show heading: set block(below: title-gap)
#show list.item: set block(below: 10pt)

// Utility snippets
#let codeblock(body) = box(
  fill: accent.lighten(86%),
  inset: 10pt,
  radius: 6pt,
  stroke: (left: stroke(thickness: 3pt, paint: accent)),
)[
  #text(font: ("DejaVu Sans Mono", "Liberation Mono", "Fira Mono", "Cousine", "Noto Sans Mono"), size: 0.95em)[#body]
]

#let aside(txt) = box(
  stroke: 1pt + accent.lighten(35%),
  inset: 8pt,
  radius: 6pt,
)[
  #text(size: 0.9em, fill: luma(15%))[#txt]
]

// ------------------------------------------------------------
// Slide 1 - Title & Thesis
#slide[
  // Title slide: no header/footer, vertically centered; compact spacing to avoid overflow
  #set page(footer: none, header: none)
  #v(1fr)
  #set text(size: 22pt)
  #show list.item: set block(below: 4pt)
  = User Stories Foundations: Beyond the Basics
  
  // Presenter name
  #v(4pt)
  #align(right)[#text(size: 0.8em, fill: luma(35%))[Enrico Pezzano - CP Course 2025/26]]
  
  #v(title-gap)
  *Thesis.* User stories are more than requirements - they're psychological tools that bridge human needs with technical solutions. We'll explore advanced techniques beyond the standard resources.

  #v(title-gap)
  *Agenda*
  - Psychology behind user stories
  - Evolution from traditional requirements
  - Advanced story anatomy & anti-patterns
  - Sophisticated persona techniques
  - Story mapping & success metrics
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 2 - The Hidden Psychology
#slide[
  #v(1fr)
  = The Hidden Psychology Behind User Stories
  #v(title-gap)
  
  #aside([
    *Why do user stories work so well psychologically?*
    - *Narrative cognition*: Humans process information 22x better in story format
    - *Empathy activation*: "As a..." triggers mirror neurons in development teams
    - *Cognitive load reduction*: Stories chunk complex requirements into digestible pieces
    - *Shared mental models*: Creates common understanding across diverse stakeholders
  ])

  #v(20pt)
  #align(center)[
    #text(style: "italic", size: 0.8em, fill: accent.darken(25%))[
      "Stories are how we think. They are how we make meaning of life." - Shawn Coyne
    ]
  ]
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 3 - Evolution from Traditional Requirements
#slide[
  #v(1fr)
  = The Evolution: From IEEE 830 to User Stories
  #v(title-gap)

  #grid(
    columns: 2,
    gutter: 20pt,
    [
      *Traditional Requirements*
      - "The system shall..."
      - Focus on WHAT
      - Comprehensive upfront
      - Technical language
      - Waterfall-friendly
    ],
    [
      *User Stories*
      - "As a user, I want..."
      - Focus on WHY and WHO
      - Evolutionary and adaptive
      - Business language
      - Agile-native
    ]
  )

  #v(20pt)
  #align(center)[#aside([*Key insight*: User stories represent a philosophical shift from "building it right" to "building the right thing"])]
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 4 - Advanced Story Anatomy
#slide[
  #v(1fr)
  = The Anatomy of Exceptional User Stories
  #v(title-gap)

  #aside([
    *Beyond the basic template - what makes stories truly effective:*
  ])

  #codeblock([
    As a [specific persona with context],
    I want to [action with clear outcome],
    So that [business value with measurable impact],
    Given [specific conditions/constraints].
  ])

  #v(10pt)
  *Advanced techniques:*
  - *Persona specificity*: "Busy executive" vs "Time-pressed C-level executive using mobile during commute"
  - *Outcome clarity*: Focus on the change, not the feature
  - *Value articulation*: Connect to business metrics or user emotions
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 5 - Anti-Patterns
#slide[
  #v(1fr)
  = The Dark Side - Common Pitfalls and Anti-Patterns
  #v(title-gap)

  #aside([
    *User Story Smells* (things not covered in standard resources):
    1. *Technical Story Syndrome*: "As a developer, I want to refactor..."
    2. *Epic Disguise*: Stories that are actually months of work
    3. *Feature Factory*: Stories without clear value proposition
    4. *Assumption Overload*: Stories built on unvalidated hypotheses
    5. *Persona Amnesia*: Generic users instead of specific personas
  ])

  #v(15pt)
  #grid(
    columns: 2,
    gutter: 15pt,
    [❌ *Bad*: "As a user, I want a dashboard"],
    [✅ *Good*: "As a sales manager reviewing weekly performance, I want to see my team's conversion rates at a glance, so I can quickly identify who needs coaching"]
  )
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 6 - Advanced Personas
#slide[
  #v(1fr)
  = Advanced Persona Techniques
  #v(title-gap)

  #aside([
    *Jobs-to-be-Done Framework Integration*:
    - *Functional job*: What task is the user trying to accomplish?
    - *Emotional job*: How does the user want to feel?
    - *Social job*: How does the user want to be perceived?
  ])

  #v(15pt)
  #codeblock([
    Persona Evolution Matrix:
    Novice → Intermediate → Expert → Champion
       ↓        ↓           ↓         ↓
    Different needs, behaviors, and success metrics
  ])

  #v(10pt)
  #align(center)[#aside([*Context matters*: Same person = different persona in different situations])]
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 7 - Story Mapping
#slide[
  #v(1fr)
  = Story Mapping - The Missing Link
  #v(title-gap)

  #aside([
    *Why story mapping revolutionizes user story organization:*
  ])

  #codeblock([
    User Journey Timeline:
    Discover → Explore → Trial → Purchase → Onboard → Use → Advocate
    
         ↓        ↓       ↓        ↓         ↓       ↓       ↓
       Stories  Stories Stories Stories  Stories Stories Stories
       (Epics)  (Epics) (Epics) (Epics)  (Epics) (Epics) (Epics)
  ])

  #v(20pt)
  #align(center)[#aside([*Key insight*: Stories without journey context are just features in disguise])]
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 8 - Advanced Acceptance Criteria
#slide[
  #v(1fr)
  = Acceptance Criteria - The Unsung Hero
  #v(title-gap)

  #grid(
    columns: 2,
    gutter: 20pt,
    [
      *Beyond Given-When-Then patterns:*
      1. *Boundary Testing AC*: What happens at the edges?
      2. *Cross-functional AC*: Security, performance, accessibility
      3. *Negative Path AC*: When things go wrong
      4. *Integration AC*: How it works with other systems
    ],
    [
      #codeblock([
        Scenario: [Happy path]
        Given [context]
        When [action]
        Then [outcome]
        
        Edge Cases:
        - What if [boundary condition]?
        - How should [error state] behave?
        - What about [accessibility]?
      ])
    ]
  )
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 9 - Success Metrics
#slide[
  #v(1fr)
  = Measuring Story Success - Beyond Velocity
  #v(title-gap)

  #aside([
    *Story success metrics often overlooked:*
    - *Value delivered*: Business metric improvement
    - *User satisfaction*: NPS, satisfaction scores
    - *Technical health*: Defect rates, performance impact
    - *Team learning*: Knowledge gained, assumptions validated
  ])

  #v(15pt)
  #codeblock([
    The Story Lifecycle:
    Written → Refined → Developed → Delivered → Measured → Learned
                         ↑                                      ↓
                         ←――――――― Feedback Loop ―――――――――――→
  ])
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 10 - Discussion & Takeaways
#slide[
  #v(1fr)
  = Discussion & Key Takeaways
  #v(title-gap)

  #aside([
    *Questions for our plenary discussion:*
    1. How can we better integrate user story practices with existing enterprise requirements processes?
    2. What role should UX research play in user story creation?
    3. How do we handle user stories for technical debt and infrastructure work?
    4. Should AI/ML features follow different user story patterns?
    5. How can we make user stories more inclusive and accessible?
  ])

  #v(15pt)
  *Beyond the mandatory readings:*
  - ✓ User stories are psychological tools, not just documentation
  - ✓ Great stories require specific personas and clear value articulation
  - ✓ Story mapping provides crucial journey context
  - ✓ Success measurement extends far beyond velocity
  - ✓ Anti-patterns are as important to recognize as best practices

  #v(10pt)
  #align(center)[
    #text(style: "italic", size: 0.8em, fill: accent.darken(25%))[
      "The best user stories are not just requirements - they're empathy engines that connect developers to real human needs."
    ]
  ]
  #v(1fr)
]

