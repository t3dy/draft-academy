# GPT2.txt → Action-Mapped Website Architecture

**Source:** GPT2.txt (803 lines)
**Output:** Implementation plan mapping every concept to a buildable site feature

---

## 1. Concept Map Extracted from GPT2.txt

### Core Thesis
LLMs are analysts. Deterministic software is infrastructure. Both needed to analyze a Magic position reliably.

### Concept Categories

| Category | Concepts |
|----------|----------|
| **Deterministic Engineering** | Document routing, file hashing, deduplication, schema validation, OCR rules, chunking, regex extraction, citation anchoring, ID assignment, database writes, export generation |
| **Probabilistic Reasoning** | Entity extraction, topic detection, summary generation, clustering, disambiguation, hypothesis generation, confidence scoring |
| **Pipeline Architecture** | Input → Parse → Normalize → Validate → Enrich → Reason → Explain → Export |
| **Agent Roles** | Input Router, Ingestion, Vision/OCR, Entity Resolution, Data Retrieval, Position Modeling, Hypothesis, Validation, Evidence, Narrative, Export |
| **Failure Modes** | OCR misread, ambiguous card names, wrong set context, missing color commitment, illegal mana use, missing data, overconfident analysis |
| **Self-Healing** | Detect mismatch → re-query → narrow candidates → retry with constraints → fall back to uncertainty |
| **Mini CS Lessons** | Schemas, canonical IDs, vector search, RAG, confidence scoring, validation gates, audit logs, provenance |
| **Website Features** | Draft coach, card analytics, archetype explorer, board state explainer, replay analyzer, evidence panel, pipeline explorer |
| **Design Principles** | LLM-as-suggester/code-as-judge, weak rules first/model second, multi-pass enrichment, repair loops |

---

## 2. Learning Modules

### Module 1: Deterministic Substrate
- **module_id:** `deterministic-substrate`
- **concept_summary:** The infrastructure layer that manages truth. Every card, match log, draft pick must be transformed into structured data. Deterministic code owns the data — LLMs cannot invent it.
- **key_learning_goals:** Understand why reproducibility matters; learn the 11 deterministic functions (routing, hashing, dedup, validation, OCR rules, chunking, regex, citation, IDs, DB writes, exports)
- **associated_pipeline_stage:** Input, Parse, Normalize, Validate
- **related_agents:** Input Router, Ingestion Agent, Validation Agent
- **interactive_examples:** Arena log parser demo, schema validation checker

### Module 2: Agentic Swarm
- **module_id:** `agentic-swarm`
- **concept_summary:** Specialized agents cooperating to solve a complex analysis problem. Each agent has a narrow task and communicates structured data.
- **key_learning_goals:** Understand agent specialization; learn how agents coordinate; see deterministic vs probabilistic boundary per agent
- **associated_pipeline_stage:** All stages
- **related_agents:** All 11 agents
- **interactive_examples:** Agent swarm visualization, step-through of a draft pick analysis

### Module 3: LLM as Analyst, Code as Judge
- **module_id:** `llm-analyst-code-judge`
- **concept_summary:** The model proposes interpretations; deterministic code verifies legality, schema compliance, evidence, and traceability.
- **key_learning_goals:** Understand why LLMs shouldn't write to canonical databases directly; learn the verification patterns
- **associated_pipeline_stage:** Reason, Validate
- **related_agents:** Hypothesis Agent, Validation Agent
- **interactive_examples:** Side-by-side: LLM proposal vs validation result

### Module 4: MTG Position Solver Pipeline
- **module_id:** `mtg-position-solver`
- **concept_summary:** Full walkthrough of turning a draft pack screenshot into a ranked pick recommendation with evidence.
- **key_learning_goals:** See all 8 pipeline stages working on one example; understand data flow
- **associated_pipeline_stage:** All
- **related_agents:** All
- **interactive_examples:** Interactive pipeline diagram, step-by-step position analysis

### Module 5: Failure Modes and Self-Healing
- **module_id:** `failure-modes`
- **concept_summary:** Systems fail. OCR misreads cards. Statistics are missing. LLMs suggest illegal moves. Good systems detect and repair.
- **key_learning_goals:** Identify common failure modes; understand repair loops; learn graceful degradation
- **associated_pipeline_stage:** Validate, Reason
- **related_agents:** Validation Agent, Evidence Agent
- **interactive_examples:** Failure scenario simulator

### Module 6: Data Provenance and Evidence
- **module_id:** `data-provenance`
- **concept_summary:** Every claim must trace back to source data. "Pick this card because..." requires evidence anchored to specific dataset rows.
- **key_learning_goals:** Understand citation anchoring; learn audit trail design; see why provenance enables trust
- **associated_pipeline_stage:** Export, Explain
- **related_agents:** Evidence Agent, Narrative Agent
- **interactive_examples:** Evidence panel showing claim → data source mapping

### Module 7: Mini CS Lessons
- **module_id:** `mini-cs-lessons`
- **concept_summary:** Embedded computer science concepts that the pipeline teaches by example.
- **key_learning_goals:** Schemas, foreign keys, canonical IDs, vector search, RAG, confidence scoring, validation gates, audit logs
- **associated_pipeline_stage:** Various
- **related_agents:** Various
- **interactive_examples:** Interactive schema builder, SQL query playground

---

## 3. Learning Journey / Action Map

```
learning_path = [
  {
    stage_id: "intro",
    stage_title: "Why MTG Is a Data Science Problem",
    concepts: ["signals-as-data", "draft-as-experiment"],
    skills_learned: ["Identifying data in game actions", "Thinking in measurements vs opinions"],
    interactive_demo: "Draft pick data explorer",
    related_code: ["17Lands CSV structure"]
  },
  {
    stage_id: "deterministic-infra",
    stage_title: "The Deterministic Substrate",
    concepts: ["deterministic-substrate", "schema-validation", "document-routing"],
    skills_learned: ["Document routing", "File hashing", "Schema validation", "ID assignment"],
    interactive_demo: "Arena log parser demo",
    related_code: ["log-tailer.js", "json-extractor.js"]
  },
  {
    stage_id: "parsing",
    stage_title: "Parsing MTG Data",
    concepts: ["streaming-json-parser", "state-machines", "log-tailing"],
    skills_learned: ["Brace-counting parser", "State machine design", "File tailing"],
    interactive_demo: "JSON parser state visualizer",
    related_code: ["json-extractor.js", "draft-extractor.js"]
  },
  {
    stage_id: "entity-resolution",
    stage_title: "Card Identity Resolution",
    concepts: ["card-identity", "entity-resolution"],
    skills_learned: ["ID mapping", "Fallback resolution", "Canonical databases"],
    interactive_demo: "grpId → card name resolver",
    related_code: ["card-db.js"]
  },
  {
    stage_id: "statistics",
    stage_title: "Statistics Retrieval and Feature Engineering",
    concepts: ["gih-winrate", "seventeen-lands-data", "feature-engineering"],
    skills_learned: ["Understanding win rate metrics", "CSV ingestion", "Feature creation"],
    interactive_demo: "Card statistics explorer",
    related_code: ["17Lands CSV parsing"]
  },
  {
    stage_id: "probabilistic",
    stage_title: "Probabilistic Reasoning",
    concepts: ["deterministic-vs-llm", "llm-analyst-code-judge", "agentic-swarm"],
    skills_learned: ["When to use LLMs vs rules", "Agent specialization", "Hypothesis generation"],
    interactive_demo: "Agent swarm step-through",
    related_code: ["Hypothesis agent prompt design"]
  },
  {
    stage_id: "validation",
    stage_title: "Validation and Self-Healing",
    concepts: ["failure-modes", "schema-validation"],
    skills_learned: ["Validation gates", "Repair loops", "Graceful fallback"],
    interactive_demo: "Failure mode simulator",
    related_code: ["Validation agent rules"]
  },
  {
    stage_id: "explanation",
    stage_title: "Explanation and Evidence",
    concepts: ["data-provenance", "narrative-design"],
    skills_learned: ["Citation anchoring", "Evidence panels", "Narrative generation"],
    interactive_demo: "Evidence panel builder",
    related_code: ["Narrative agent output format"]
  },
  {
    stage_id: "full-example",
    stage_title: "Full MTG Position Solver",
    concepts: ["pipeline-architecture", "integration-order"],
    skills_learned: ["End-to-end pipeline thinking", "Integration ordering"],
    interactive_demo: "Complete position solver walkthrough",
    related_code: ["Full pipeline orchestration"]
  }
]
```

---

## 4. Interactive Components

| Component | Type | Description | Inputs | Outputs | Visualization |
|-----------|------|-------------|--------|---------|---------------|
| MTG Data Pipeline Diagram | diagram | 8-stage pipeline with clickable stages | None | Selected stage detail | Horizontal flow chart, green/purple coding |
| Draft Pick Solver | simulation | Walk through a P1P3 decision step by step | Pack of 15 cards | Ranked recommendations | Step-by-step accordion |
| Arena Log Parser Demo | code walkthrough | Show how JSON extractor processes log lines | Sample log lines | Extracted JSON objects | Character-by-character state highlight |
| Card Statistics Explorer | example analysis | Browse 17Lands stats for cards | Card name or set | Win rates, color pair data | Data table with sortable columns |
| Agent Swarm Visualization | diagram | Show all 11 agents and their connections | None | Agent detail on click | Network graph layout |
| Schema Validator | simulation | Enter card data and check schema compliance | JSON card object | Pass/fail with explanations | Red/green field highlighting |
| Failure Mode Simulator | simulation | Trigger failure scenarios and watch repair | Scenario selector | Recovery steps | Animated repair loop |
| Evidence Panel | example analysis | Show how a pick recommendation traces to data | Pick recommendation | Data sources linked | Claim → evidence mapping |

---

## 5. Agent Swarm Architecture

| Agent | Role | Det/Prob | Inputs | Outputs | Example Task |
|-------|------|----------|--------|---------|-------------|
| Input Router | Route input to correct pipeline | Deterministic | Raw input (image, log, CSV, text) | Pipeline selection + normalized input | Screenshot → vision pipeline, CSV → stats pipeline |
| Ingestion Agent | Parse structured data from raw input | Deterministic | Routed input | Structured records (cards, picks, states) | Extract 15 card IDs from draft log JSON |
| Vision Agent | OCR/CV for image inputs | Probabilistic | Screenshot or image | Detected card names + confidence | Read card names from draft pack screenshot |
| Entity Resolution | Match to canonical card database | Deterministic | Detected names/IDs | Canonical card objects | Map "Sheoldred" → exact card with set, ID, stats |
| Data Retrieval | Fetch historical statistics | Deterministic | Card IDs + context (format, colors) | Win rates, ALSA, IWD, matchup data | Get GIH WR% for each card in player's colors |
| Position Modeling | Build structured game/draft state | Deterministic | Cards, picks, board state | Position object (colors, curve, synergies) | Estimate color commitment after 5 picks |
| Hypothesis Agent | Generate candidate actions | Probabilistic | Position + statistics | Ranked candidates with reasoning | Suggest top 3 picks with rationale |
| Validation Agent | Check outputs against rules | Deterministic | Candidate actions | Approved/rejected with reasons | Reject pick of card not in current pack |
| Evidence Agent | Anchor claims to data sources | Deterministic | Recommendations + data | Cited recommendations | Link "57% GIH WR" to specific dataset row |
| Narrative Agent | Explain results to user | Probabilistic | Validated, cited results | Human-readable explanation | "Pick Sheoldred because her win rate in BW is..." |
| Export Agent | Format for website display | Deterministic | Explained results | JSON, chart configs, HTML blocks | Generate pick ranking component data |

---

## 6. Visualization Diagrams

### Diagram 1: MTG Position Solver Pipeline
```
[Input] → [Parse] → [Normalize] → [Validate] → [Enrich] → [Reason] → [Explain] → [Export]
  ↑ Router    ↑ Ingestion  ↑ Entity Res  ↑ Validation  ↑ Data Retr  ↑ Hypothesis  ↑ Narrative  ↑ Export
  DET         DET          DET           DET           DET          PROB          PROB         DET
```
- Green boxes: deterministic stages
- Purple boxes: probabilistic stages
- Arrows show data flow
- Click any stage to see detail panel below

### Diagram 2: Agentic Swarm Architecture
Network graph: 11 agent nodes arranged in a flow. Connections show data dependencies.
- Central cluster: Router → Ingestion → Entity Resolution → Data Retrieval
- Branching: Position Modeling feeds Hypothesis feeds Validation
- Output chain: Evidence → Narrative → Export
- Color coding: green nodes = deterministic, purple = probabilistic

### Diagram 3: Deterministic vs Probabilistic Layers
Two-column comparison:
- Left (green): "What must always happen" — routing, parsing, validation, storage
- Right (purple): "What probably means" — classification, hypothesis, explanation
- Center: arrows showing how probabilistic outputs flow through deterministic gates

### Diagram 4: Self-Healing Loop
Circular flow: Detect Error → Identify Type → Select Strategy → Retry/Narrow/Fallback → Validate → Accept or Re-enter Loop
- OCR error branch: fuzzy match → candidate list → user confirmation
- Missing data branch: similarity search → related card stats → uncertainty flag
- Illegal move branch: constraint check → filter candidates → re-rank

---

## 7. Site Folder Structure

```
/draft-academy
  /src
    /components
      Header.tsx              — Top navigation
      LessonCard.tsx          — Content node card
      LayerTabs.tsx           — Intuition/System/Technical/Project/Theory switcher
      QuizCard.tsx            — Interactive quiz
      PipelineDiagram.tsx     — 8-stage pipeline visualization
      AgentCard.tsx           — Agent role card
      SearchFilter.tsx        — Search and filter bar
      PathwayCard.tsx         — Learning pathway card
    /pages
      HomePage.tsx            — Landing page with hero + featured content
      BrowsePage.tsx          — Browse all concepts with filtering
      LessonPage.tsx          — Individual lesson with layer tabs
      PathwaysPage.tsx        — All learning pathways
      PathwayDetailPage.tsx   — Single pathway detail
      TweetsPage.tsx          — Tweet swarm display
      PipelinePage.tsx        — Pipeline + agent swarm educational page
    /data
      types.ts                — TypeScript type definitions
      content.ts              — 30 content nodes + 5 pathways + 11 agents + 8 pipeline stages
      tweets.ts               — 10 tweet series with 150+ tweets
    App.tsx                   — Router setup
    main.tsx                  — Entry point
    index.css                 — Global styles and CSS variables
```

---

## 8. JSON Content Blocks for Frontend

Each content node maps to a loadable block:

```json
{
  "module_id": "deterministic-substrate",
  "title": "The Deterministic Substrate",
  "summary": "Infrastructure that manages truth. Deterministic code owns the data.",
  "sections": [
    {
      "layer": "intuition",
      "content": "Think of it as the filing system..."
    },
    {
      "layer": "system",
      "content": "The substrate handles 11 functions: routing, hashing..."
    },
    {
      "layer": "technical",
      "content": "Implementation uses fs.watchFile for log tailing..."
    },
    {
      "layer": "project",
      "content": "Build a minimal log parser that extracts draft picks..."
    },
    {
      "layer": "theory",
      "content": "Determinism is not about simplicity..."
    }
  ],
  "interactive_components": ["arena-log-parser", "schema-validator"],
  "related_agents": ["input-router", "ingestion-agent", "validation-agent"]
}
```

This pattern repeats for all 30 content nodes, each stored as a ContentNode in the TypeScript data file.

---

## 9. Completeness Check

Every concept from GPT2.txt maps to:

| GPT2.txt Concept | Learning Module | Pipeline Stage | Agent | Website Feature |
|-------------------|-----------------|----------------|-------|-----------------|
| Document routing | deterministic-substrate | Input | Input Router | Pipeline explorer |
| File hashing | deterministic-substrate | Input | Ingestion Agent | Pipeline explorer |
| Deduplication | deterministic-substrate | Parse | Ingestion Agent | Pipeline explorer |
| Schema validation | schema-validation | Validate | Validation Agent | Schema validator demo |
| OCR invocation | agentic-swarm | Parse | Vision Agent | OCR demo |
| Chunking rules | streaming-json-parser | Parse | Ingestion Agent | Parser demo |
| Regex extraction | streaming-json-parser | Parse | Ingestion Agent | Parser demo |
| Citation anchoring | data-provenance | Explain | Evidence Agent | Evidence panel |
| ID assignment | card-identity | Normalize | Entity Resolution | Card resolver |
| Database writes | sql-thinking | Validate | — | SQL playground |
| Export generation | pipeline-architecture | Export | Export Agent | Dashboard |
| LLM-as-suggester | llm-analyst-code-judge | Reason | Hypothesis Agent | Pick ranker |
| Weak rules first | deterministic-vs-llm | Parse | Ingestion Agent | Pipeline explorer |
| Multi-pass enrichment | feature-engineering | Enrich | Data Retrieval | Stats explorer |
| Repair loops | failure-modes | Validate | Validation Agent | Failure simulator |
| Draft coach | — (feature) | All | All | Draft coach page |
| Card analytics | — (feature) | Enrich | Data Retrieval | Card profile pages |
| Archetype explorer | archetype-detection | Reason | Hypothesis Agent | Archetype page |
| Board state explainer | — (feature) | All | Vision + Position | Board explainer |
| Replay analyzer | — (feature) | Parse + Reason | Ingestion + Hypothesis | Replay page |
| Evidence panel | data-provenance | Explain | Evidence Agent | Evidence panel |
| Pipeline explorer | pipeline-architecture | All | All | Pipeline page |

**Nothing remains abstract. Everything maps to something implementable.**

---

## 10. Implementation Priority

1. **Now (built):** Content nodes, pathways, pipeline stages, agent roles, tweet swarm — all in TypeScript data files
2. **Now (built):** React components for cards, tabs, quiz, pipeline diagram, search
3. **Now (built):** Pages with routing, progressive disclosure, filtering
4. **Next:** Interactive demos (parser visualizer, failure simulator, SQL playground)
5. **Later:** Real 17Lands data integration, actual MTG card database, live demos
