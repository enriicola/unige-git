#import "@preview/polylux:0.4.0": *

// Theme ------------------------------------------------------
#let accent = rgb(0x1e, 0x8e, 0x3e)
#let my-stroke = stroke(thickness: 2pt, paint: rgb(0xd4, 0xaf, 0x37), cap: "round")

// Global text style: readable sans with fallbacks
#show link: set text(accent.darken(45%))
#set text(font: ("Liberation Sans", "DejaVu Sans", "Noto Sans", "Open Sans", "Roboto"), size: 24pt)

#set page(
  // ~16:10 aspect ratio
  width: 13in,
  height: 8in,
  margin: 2cm,
  footer: [
    #set text(size: .6em)
    #set align(horizon)
    #text(fill: luma(45%))[Flipped Classroom]
    #h(1fr)
    #toolbox.slide-number
  ],
  header: box(stroke: (bottom: my-stroke), inset: 8pt)[
    #set text(size: .6em)
    #set align(horizon)
    #text(fill: accent.darken(45%))[Pair Programming]
    #h(1fr)
  ],
)

// Heading and list rhythm
#show heading: set text(fill: accent.darken(45%), weight: "bold")
#let title-gap = 20pt
#let bullet-gap = 1pt
#show heading: set block(below: title-gap)
#show list.item: set block(below: 30pt)

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

#let refitem(n, body) = par(hanging-indent: 2.2em)[[#n] #body]

// ------------------------------------------------------------
#slide[
  #set page(footer: none, header: none)
  #v(1fr)
  #set text(size: 22pt)
  #show list.item: set block(below: 6pt)
  = Pair Programming in Scrum
  
  #v(4pt)
  #align(right)[#text(size: 0.8em, fill: luma(35%))[by Enrico Pezzano, 4825087]]
  
  #v(title-gap)
  #align(center)[#image("images/title.jpg", width: 50%, fit: "contain")]
  #v(1fr)
]
// ------------------------------------------------------------
#slide[
  #v(1fr)
  = What is it?
  #v(title-gap)
  #v(1fr)
]
// ------------------------------------------------------------
#slide[
  #v(1fr)
  = What is it?
  #v(title-gap)
  Pair programming is when two programmers work together at one workstation.
  #v(1fr)
]
// ------------------------------------------------------------
#slide[
  #v(1fr)
  = What is it?
  #v(title-gap)
  Pair programming is when two programmers work together at one workstation.
  #v(12pt)
  The end.
  #v(1fr)
]
// ------------------------------------------------------------
#slide[
  #v(1fr)
  = What is it?
  #v(title-gap)
  Pair programming is when two programmers work together at one workstation.
  #v(12pt)
  The end.
  #v(8pt)
  Questions?
  #v(1fr)
]
// ------------------------------------------------------------
#slide[
  #v(1fr)
  = jokes on you, I'm not actually finished
  #v(title-gap)
  here are some more details about pair programming
  #v(1fr)
]
// ------------------------------------------------------------
#slide[
  #v(1fr)
  = What is pair programming? (this time for real)
  #v(title-gap)
  #grid(
    columns: (3fr, 2fr),
    gutter: 5pt,
    align: horizon,
    [
      - the "driver" 
      #v(bullet-gap)
      - the "navigator"
      #v(bullet-gap)
      - "mezz'orette"
      #v(bullet-gap)
      - encourages collaboration and knowledge sharing
      #v(bullet-gap)
      - covid trauma flashbacks :)
    ],
    [
      #align(center)[#image("images/2.jpeg", width: 65%, fit: "contain")]
    ],
  )
  #v(1fr)
]
// ------------------------------------------------------------
#slide[
  #v(1fr)
  = What is pair programming? (this time for real) 2
  #v(title-gap)
  #grid(
    columns: (3fr, 2fr),
    gutter: 5pt,
    align: horizon,
    [
      - Increases code quality and knowledge sharing
      #v(bullet-gap)
      - Reduces bugs and improves team cohesion
      #v(bullet-gap)
      - Higher productivity per line of code
      #v(bullet-gap)
      - Onboarding and mentoring opportunities
    ],
    [
      #align(center)[#image("images/3.png", width: 65%, fit: "contain")]
    ],
  )
  #v(1fr)
]
// ------------------------------------------------------------
#slide[
  #v(1fr)
  = Thank you!
  #v(title-gap)
  Questions?
  #v(1fr)
]
