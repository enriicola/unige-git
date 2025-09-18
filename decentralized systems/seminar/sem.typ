// direttive prof 1:
// In linea di massima il seminario non deve essere la pubblicità di qualche piattaforma/soluzione blockchain, ma dovrebbe prendere spunti anche da qualche lavoro scientifico. Oltre ai link che mi hai mandato, ci sono anche paper che descrivono questi token in modo un po' tecnico?

// direttive prof 2:
// il seminario dovrebbe essere un seminario tecnico di argomenti di sistemi distribuiti.
// Una discussione finanziaria, un mero elenco di feature, eccetera, sono questioni fuori dallo scope del corso.
// Viceversa è interessante sentire se sono stati risolti dei problemi informatici non ovvi, e conoscere il cuore di queste soluzioni.


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
    #text(fill: luma(45%))[Decentralized Systems Seminar]
    #h(1fr)
    #toolbox.slide-number
  ],
  header: box(stroke: (bottom: my-stroke), inset: 8pt)[
    #set text(size: .6em)
    #set align(horizon)
    #text(fill: accent.darken(45%))[DeSoc + Tokenized Equities]
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

// References helpers: numbered with hanging indent, compact sizing
#let refitem(n, body) = par(hanging-indent: 2.2em)[[#n] #body]


// ------------------------------------------------------------
// Slide 1 - Title & Thesis
#slide[
  // Title slide: no header/footer, vertically centered; compact spacing to avoid overflow
  #set page(footer: none, header: none)
  #v(1fr)
  #set text(size: 22pt)
  #show list.item: set block(below: 4pt)
  = Decentralized Society (DeSoc): Souls, SBTs & a peek at Tokenized Equities
  
  // Presenter name
  #v(4pt)
  #align(right)[#text(size: 0.8em, fill: luma(35%))[Enrico Pezzano, 4825087]]
  
  #v(title-gap)
  *Thesis.* Non-transferable attestations (Soulbound Tokens, SBTs) encode identity & reputation on-chain. We'll discuss the DeSoc vision and briefly see how tokenized equities implement a similar idea for compliance.

  #v(title-gap)
  *Agenda*
  - What DeSoc/SBTs are and why they matter
  - Use cases and key mechanisms
  - Bootstrapping DeSoc: standards, privacy, recovery
  - Case studies and open problems
  - Bridge: tokenized equities (compliance attestations, DvP)
  #v(1fr)
  #place(bottom + right)[#image("imgs/title.png", width: 22%, fit: "contain")]
]

// ------------------------------------------------------------
// Slide 2 - Problem Statement
#slide[
  #v(1fr)
  = Problem: Assets without Identity
  #v(title-gap)
  
  #grid(
    columns: 2,
    gutter: 20pt,
    [
      // Crop horizontally by fitting the image inside a larger clipped box
      #box(width: 7cm, height: 5.25cm, clip: true)[
        // Bias crop to the left by ~25%: make image wider and align to right
        #align(right)[
          #image("imgs/unidentifiable.jpg", width: 140%, height: 100%, fit: "cover")
        ]
      ]
    ],
    [
      - Blockchains excel at *scarce assets* (fungible tokens, NFTs), but are weak at *social identity* (who, history, trust).
      - Missing primitives:
        - under-collateralized lending
        - sybil-resistant governance
        - reputation-based communities
    ],
  )
  #v(20pt)
  #align(center)[#aside([*Can we add identity to Web3 without re-centralizing trust?*])]
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 3 - Core Idea (Souls & SBTs)
#slide[
  #v(1fr)
  = Core Idea: Souls & Soulbound Tokens
  #v(title-gap)

  #grid(
    columns: (1.2fr, 0.8fr),
    gutter: 20pt,
    [
      #set text(size: 0.95em)
      #aside([
        - *Soul*: account/wallet (often pseudonymous) that accumulates relationships over time.
        - *SBT*: non-transferable (issuer-revocable, we'll see this later) attestation bound to a Soul; like an on-chain CV entry.
      ])
      #v(8pt)
      #aside([
        *Examples*
        - Educational credential; employment/affiliation
        - DAO membership or contribution badge
        - Reputation marks (e.g., on-time repayment)
      ])
    ],
    [
      #align(center)[#image("imgs/idea.png", width: 85%, fit: "contain")]
    ],
  )

  #v(1fr)
]

// ------------------------------------------------------------
// Slide 4 - Core Idea (cont.)
#slide[
  #v(1fr)
  = Core Idea: Attestations & Composability
  #v(title-gap)

  #grid(
    columns: (1.2fr, 0.8fr),
    gutter: 20pt,
    [
      #show list.item: set block(below: 12pt)
      - Self-claimed or, more powerfully, issued by counterpart Souls (people, DAOs, institutions).
      #v(14pt)
      - A composable *web of attestations* enabling provenance and reputation directly on-chain.
      #v(14pt)
      - Queryable trust graphs that other apps can build on.
    ],
    [
      #align(center)[#image("imgs/idea.png", width: 70%, fit: "contain")]
    ],
  )

  

  #v(1fr)
]

// ------------------------------------------------------------
// Slide 5 - Core Idea: Web of Attestations
#slide[
  #v(1fr)
  = Core Idea: Web of Attestations

  #align(center)[#image("imgs/trust-graph.svg", width: 65%, fit: "contain")]
  #align(horizon)[#aside([Stairway to DeSoc: provenance → soul lending → community recovery → measuring decentralization (correlation-aware)])]

  #v(1fr)
]

// ------------------------------------------------------------
// Slide 6 - Use Cases I: Finance & Reputation
#slide[
  #v(1fr)
  = Use Cases I: Finance & Reputation
  #v(title-gap)
  
  #grid(
    columns: 2,
    gutter: 4%,
    [
      #image("imgs/soul.png", height: 50%, fit: "contain")
    ],
    [
      #box(height: 50%)[
        #v(1fr)
        - *Soul lending*: under-collateralized credit using attestations (e.g., repayment history, affiliations).
        - *Provenance*: creators/artists stake identity; collections and scarcity attested as SBTs.
        - *Reputation graphs*: cross-issuer attestations compose into richer, queryable trust signals.
        #v(1fr)
      ]
    ],
  )
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 7 - Use Cases II: Governance & Communities
#slide[
  #v(1fr)
  = Use Cases II: Governance & Communities
  #v(title-gap)

  #grid(
    columns: 2,
    gutter: 4%,
    [
      #image("imgs/uc2.png", height: 75%, fit: "contain")
    ],
    [
      #box(height: 75%)[
        #v(1fr)
        - *Sybil resistance*: voting/participation weighted by diverse attestations, not just coin holdings.
        - *Correlation discounts*: reduce influence of tightly correlated clusters to deter capture.
        - *Community recovery*: social key recovery via trusted circles when a Soul loses access.
        - *Souldrops*: targeted distributions to Souls with relevant, verifiable contributions.
        #v(1fr)
      ]
    ],
  )
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 8 - Mechanisms: Privacy & Plurality
#slide[
  #v(1fr)
  = Mechanisms: Privacy & Plurality
  #v(title-gap)
  
  #grid(
    columns: 2,
    gutter: 1%,
    [
      #image("imgs/s6.png", height: 75%, fit: "contain")
    ],
    [
      #box(height: 75%)[
        #v(1fr)
        - *Programmable plural privacy*: commit on-chain, keep data off-chain, prove properties via ZK without revealing PII (personally identifiable information).
        - *Plural sensemaking*: combine attestations, AI, and markets for contestable collective judgments.
        - *Revocation/expiry*: issuers can revoke or time-limit SBTs; clients verify freshness at use-time.
        - *Measuring decentralization*: use correlation-aware metrics built from SBT graphs.
        - *Quadratic funding/voting with discounts*: account for correlation to resist plutocratic capture.
        #v(1fr)
      ]
    ],
  )
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 9 - Limitations & Risks
#slide[
  #v(1fr)
  = Limitations & Risks
  #v(title-gap)

  #grid(
    columns: 2,
    gutter: 0%,
    [
      #image("imgs/limitations.png", height: 75%, fit: "contain")
    ],
    [
      #box(height: 75%)[
        #v(1fr)
        - *Privacy leakage & coercion*: public SBTs may expose sensitive affiliations; + coercive demands.
        - *Issuer collusion & low-quality attestations*: requires governance and audits.
        - *Harassment & exclusion*: potential misuse for BlackMirror-style “social credit” systems, blacklisting, or targeted harassment.
        - *Recovery abuse*: community recovery can be exploited by colluding or malicious guardians.
        - *Bootstrapping*: ...
        #v(1fr)
      ]
    ],
  )

  #v(1fr)
]

// ------------------------------------------------------------
// Slide 10 - Bootstrapping DeSoc
#slide[
  #v(1fr)
  = ...Bootstrapping DeSoc: What Exists Today
  #v(title-gap)

  #grid(
    columns: (1.2fr, 0.8fr),
    gutter: 1%,
    [
      - Early building blocks (§5, §7):
        - *On-chain* attestations/POAPs/registries.
        - *Off-chain* VCs with on-chain anchors.
      #v(10pt)
      - Design principles:
        - Start public, then add privacy (commitments/ZK).
        - Prefer *issuer* attestations; check revocation/freshness.
        - Iterate issuers & revocation norms toward stronger privacy.
    ],
    [
      #align(center)[#image("imgs/bootstrap.jpg", height: 60%, fit: "contain")]
    ],
  )
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 11 - Community Recovery
#slide[
  #v(1fr)
  = Community Recovery
  #v(title-gap)

  #grid(
    columns: 2,
    gutter: 4%,
    [
      #image("imgs/recovery.png", height: 75%, fit: "contain")
    ],
    [
      #box(height: 75%)[
        #v(1fr)
        - *Guardians*: nominate trusted peers or institutions as recovery guardians (SBTs).
        #v(12pt)
        - *Threshold*: t-of-n approvals, with a timelock to deter abuse.
        #v(12pt)
        - *Scope*: rotate keys and rebind identity only; no asset moves.
        #v(12pt)
        - *Auditability*: public intent, delay, and revocation path.
        #v(12pt)
        - *Role*: mid-step in the stairway to DeSoc.
        #v(1fr)
      ]
    ],
  )
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 12 - Case Studies
#slide[
  #v(1fr)
  = Case Studies
  #v(title-gap)

  #grid(
    columns: (1.2fr, 0.8fr),
    gutter: 6%,
    [
      - *EAS*: generic attestations; schemas, revocation, on-chain queries.
      #v(10pt)
      - *Gitcoin Passport*: sybil-resistance from multi-source stamps; early correlation-aware scoring.
      #v(10pt)
      - *POAP badges*: event attendance attestations; simple, transferable format evolving toward non-transferable use.
      #v(10pt)
      - *DAO badges/roles*: governance gated by non-transferable credentials and contribution history.
    ],
    [
      #align(center)[#image("imgs/case-studies.png", height: 70%, fit: "contain")]
    ],
  )
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 13 - Bridge: From Souls to Securities
#slide[
  #v(1fr)
  = Bridge: From Souls to Securities
  #v(title-gap)

  #grid(
    columns: 2,
    gutter: 5%,
    [
      #align(center)[#image("imgs/stocks.png", height: 75%, fit: "contain")]
    ],
    [
      #box(height: 75%)[
        #v(1fr)
        - In real finance, *tokenized equities* (security tokens) #underline[already rely on *attestations*].
        #v(12pt)
        - *Compliance as code* ... 
        #v(12pt)
        - *Wallet as credential holder*: attestations + expiry/revocation decide transferability.
        #v(12pt)
        - Atomic *Delivery-versus-Payment* → avoid settlement risk.
        #v(12pt)
        - *Parallel to SBTs*: #underline[non-transferable credentials] gate actions.
        #v(1fr)
      ]
    ],
  )
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 14 - Tokenized Equities: Standards
#slide[
  #v(1fr)
  = Tokenized Equities: Standards
  #v(title-gap)

  #grid(
    columns: (1.4fr, 0.6fr),
    gutter: 4%,
    [
      - *ERC-1400 family*
        - Partitions (e.g., restricted vs public tranches)
        - Operator roles (registrar/transfer agent)
        - Document links & error signaling
      - *ERC-3643 (T-REX)*
        - Compliance contract per transfer: `canTransfer(from, to, amount)`
        - ONCHAINID identity; off-chain credentials, on-chain refs
    ],
    [
      #image("imgs/tokenized-stocks.png", width: 100%, fit: "contain")
    ],
  )
  #v(12pt)
  #align(center)[Both enable programmable compliance on public chains.]
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 15 - Tokenized Equities: ...Compliance as Code
#slide[
  #v(1fr)
  = Tokenized Equities: Compliance as Code
  #v(title-gap)
  
  #codeblock(```
  fn _update(address from, address to, uint256 value) internal override{
    if (from != address(0) && to != address(0)) {
      (bool ok, string memory reason) = comp.canTransfer(from, to, value);
      if (!ok) revert ComplianceViolation(reason);
    }
    super._update(from, to, value);
  }
  ```)
  #v(12pt)
  - It transfers check eligibility (KYC, jurisdiction, investor type, lockups, sanctions).
  - If attestations are valid → transfer settles.
  - If expired / revoked / jurisdiction fails → transaction *reverts*.
  - This embeds *permissioned rules* on *permissionless rails*.
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 16 - Tokenized Equities: Benefits & Trade-Offs
#slide[
  #v(1fr)
  = Tokenized Equities: Benefits & Trade-Offs
  #v(title-gap)
  
  *Benefits*
  - *Atomic DvP*: cash & stock settle in one transaction → no principal risk.
  - *Cross-border distribution*: global cap table, local rules in code.
  - *Corporate actions as code*: dividends, voting, cap-table updates.
  - *Machine-auditability*: regulators verify events, not PDFs.
  
  *Trade-offs*
  - *Liquidity fragmentation*: whitelists constrain venues.
  - *Legal overhang*: shareholder rights remain off-chain.
  - *Privacy vs auditability*: data minimization vs supervision.
  - *Retail benefit limited*: post T+1, marginal gains for typical investors.
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 17 - bridge from theory to practice
#slide[
  #v(1fr)
  = Bridge: From Theory to Practice
  #v(title-gap)

  #grid(
    columns: 2,
    gutter: 20pt,
    [
      DeSoc ("theory")
      - Identity: Soul + non-transferable tokens
      - Use: governance, reputation, recovery
      - Privacy: ZK proofs & correlation-aware metrics
    ],
    [
      Tokenized equities ("practice")
      - Identity: wallet + eligibility credentials
      - Enforcement: compliance checks at transfer
      - Operations: DvP; corporate actions as code
    ]
  )

  #v(title-gap)
  #align(center)[#aside([Both on public, permissionless blockchains])]
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 18 - Critical Reflections (from Lecture 21)
#slide[
  #v(1fr)
  = DeSoc - Critical Reflections :)
  // #v(title-gap)

  #grid(
    columns: 2,
    gutter: 4%,
    [
      #align(horizon)[
        - *User tendency to centralization*
        - Sybil attacks vs. democracy
        - *Red flags* and *scams*
        #v(12pt)
        - *DeSoc downsides*
          - Stigmatization and exclusion
          #v(6pt)
          - Attestation quality and issuer bias
          #v(6pt)
          - Collusion and correlation in governance
          #v(6pt)
          - Cross-chain linkability of identities
          #v(6pt)
          - Privacy leakage and revocation usability
      ]
    ],
    [
      #box(height: 90%)[
        #align(center)[#image("imgs/do-u-need-bc.png", height: 50%, fit: "contain")]
        #align(center)[#image("imgs/truth.png", height: 50%, fit: "contain")]
      ]
    ],
  )

  #v(1fr)
]

// ------------------------------------------------------------
// Slide 19 - Latest News
#slide[
  #v(1fr)
  = Latest News 📰
  #v(title-gap)

  #grid(
    columns: 2,
    gutter: 4%,
    [
      *September Developments (2025)*
      #set text(size: 0.9em)
      #show list.item: set block(below: 6pt)
      
      - *Nasdaq pushes to launch trading* of tokenized securities
        #text(size: 0.8em, fill: gray)[#link("https://www.reuters.com/business/finance/nasdaq-makes-push-launch-trading-tokenized-securities-2025-09-08/")[Reuters, Sept 8]]
      
      - *Figure raises \$787.5M in US IPO* - blockchain lender goes public
        #text(size: 0.8em, fill: gray)[#link("https://www.reuters.com/business/finance/blockchain-lender-figure-raises-7875-million-us-ipo-2025-09-11/")[Reuters, Sept 11]]
      
      - *BlackRock seeks to tokenize ETFs* after Bitcoin fund breakthrough
        #text(size: 0.8em, fill: gray)[#link("https://www.bloomberg.com/news/articles/2025-09-11/blackrock-seeks-to-tokenize-etfs-after-bitcoin-fund-breakthrough?accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzb3VyY2UiOiJTdWJzY3JpYmVyR2lmdGVkQXJ0aWNsZSIsImlhdCI6MTc1NzcyNDUyOCwiZXhwIjoxNzU4MzI5MzI4LCJhcnRpY2xlSWQiOiJUMkNESDhHUFdDTDEwMCIsImJjb25uZWN0SWQiOiJBODlERUQ0MjI1Qjk0Q0I4QkJBRUE0ODAwRTE5Mjk4NiJ9.-iUCpm018ysBfiFXvZonYupiu5LLb_hgxIF0jsyyQWM&utm_source=tldrfintech&leadSource=uverify%20wall")[Bloomberg, Sept 11]]
    ],
    [
      *Impact & Implications*
      #set text(size: 0.9em)
      #show list.item: set block(below: 6pt)
      
      - Traditional finance embracing tokenization at scale
      
      - Infrastructure providers (Nasdaq) building rails
      
      - Institutional adoption accelerating beyond crypto
      
      #v(12pt)
    ]
  )

  #v(1fr)
]

// ------------------------------------------------------------
// Slide 20 - takeaways
#slide[
  #v(1fr)
  = Takeaways
  #v(title-gap)
  #set text(size: 0.95em)
  #show list.item: set block(below: 8pt)

  #grid(
    columns: 2,
    gutter: 4%,
    [
      #box(height: 45%)[
        #image("imgs/takeaways.jpg", height: 100%, fit: "contain")
      ]
    ],
    [
      #box(height: 55%)[
        #v(1fr)
        - Attestations are only as strong as issuers and revocation.
        - Non-transferable ≠ risk-free: design for privacy, coercion, correlation.
        - Compliance gates can work on public chains; law and operations still rule.
        - Code is not law: test, audit, monitor; contracts do what we wrote.
        - No one seems to care about tokenized stocks, despite their benefits [6][SEC].
        #v(1fr)
      ]
    ],
  )
  #v(30pt)
  #align(horizon)[#aside([Stairway to DeSoc: provenance → soul lending → community recovery → decentralization metrics (correlation-aware)])]
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 20 - Thanks & Questions
#slide[
  #v(1fr)
  = Thanks for the attention
  #v(title-gap)

  *Questions?*
  #v(1fr)
]

// ------------------------------------------------------------
// Slide 21 - References
#slide[
  = References
  #v(title-gap)

  #set text(size: 0.9em)
    #refitem(1, [Buterin, V., Hitzig, Z., Weyl, E. (2022). #emph[Decentralized Society: Finding Web3's Soul]. #link("https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4105763")[papers.ssrn.com]])
    #v(6pt)
    #refitem(2, [Lecture 21: Are Blockchains Any Good? - Prof. MDA & Prof. MR])
    #v(6pt)
    #refitem(3, [ERC-1400 Security Token Standard (Partitions, Operators, Documents). #link("https://github.com/SecurityTokenStandard/EIP-Spec")[github.com/SecurityTokenStandard].])
    #v(6pt)
    #refitem(4, [ERC-3643 (T-REX) and ONCHAINID documentation. #link("https://www.erc3643.org/")[erc3643.org] · #link("https://github.com/onchain-id/documentation")[github.com/onchain-id/documentation]])
    #v(6pt)
    #refitem(5, [Atomic Delivery-versus-Payment (DvP) patterns for tokenized assets. 
      CPMI (BIS) report: #link("https://www.bis.org/cpmi/publ/d163.htm")[bis.org/cpmi/publ/d163.htm] · 
      #link("https://www.bis.org/cpmi/publ/d163.pdf")[PDF]])
]

// ------------------------------------------------------------
// Slide 22 - References (2)
#slide[
  = References (2)
  #v(title-gap)

  #set text(size: 0.9em)
    #refitem(6, [Zero-knowledge KYC / Verifiable Credentials on public chains (surveys and implementations). 
      Spec: #link("https://www.w3.org/TR/vc-data-model/")[w3.org/TR/vc-data-model] · 
      Impl: #link("https://docs.polygon.technology/tools/identity/polygon-id/")[Polygon ID docs]])
    #v(6pt)
    #refitem(7, [r/DeFi. "Why does no one seem to care about tokenized stocks, despite all of their benefits?" #link("https://www.reddit.com/r/defi/comments/uvwtbr/why_does_no_one_seem_to_care_about_tokenized/")[reddit.com/r/defi]])
    #v(6pt)
    #refitem(8, [Finance Magnates. "Could Tokenized Stocks Bring Volume to the Market?" #link("https://www.financemagnates.com/thought-leadership/could-tokenized-stocks-bring-volume-to-the-market/")[financemagnates.com]])
    #v(6pt)
    #refitem(9, [YouTube. "Tokenized equities explained: How xStocks are changing the digital economy." #link("https://www.youtube.com/watch?v=OpiyVve5URM")[youtube.com/watch?v=OpiyVve5URM]])
    #v(6pt)
    #refitem(10, [SEC (United States Securities and Exchange Commission). "Framework for 'Investment Contract' Analysis of Digital Assets." #link("https://www.sec.gov/corpfin/framework-investment-contract-analysis-digital-assets")[sec.gov]])
]
