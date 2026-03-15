# Draft Academy

**Live site:** [https://t3dy.github.io/draft-academy/](https://t3dy.github.io/draft-academy/)

Learn data engineering, statistics, and AI engineering through Magic: The Gathering draft analysis.

## What This Is

Draft Academy is an educational website that uses MTG draft analysis and [17Lands](https://www.17lands.com/) data as a concrete, motivating case study to teach real computer science, data science, and AI engineering concepts. The domain is Magic: The Gathering — but the skills transfer everywhere.

The project started from two design documents (~1,400 lines total) that mapped out a vision for teaching through a working data pipeline. Those documents were architecturally decomposed into buildable modules, then implemented as a fully typed React application with 30 interconnected lessons, 5 learning pathways, interactive quizzes, and a tweet-style content layer.

### What You'll Learn

- **Data engineering:** Log parsing, streaming JSON extraction, schema validation, pipeline architecture, event emitters, state machines
- **Data science:** Win rate analysis (GIH WR%), feature engineering, archetype detection, signal theory, experimental design
- **AI engineering:** Deterministic vs probabilistic systems, agentic swarms, tool-calling, LLM orchestration, the "LLM as analyst, code as judge" pattern
- **Systems thinking:** State machines, event-driven architecture, vertical slices, integration ordering, the two-window pattern
- **Pedagogy:** Progressive disclosure, quiz-driven learning, narrative design, multiple learner pathways

## Quick Start

```bash
git clone https://github.com/t3dy/draft-academy.git
cd draft-academy
npm install
npm run dev
```

Open [http://localhost:5173/draft-academy/](http://localhost:5173/draft-academy/)

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| [React](https://react.dev/) | 19.2 | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.9 | Type safety across all content and components |
| [Vite](https://vite.dev/) | 8.0 | Build tool (uses Rolldown bundler) |
| [react-router-dom](https://reactrouter.com/) | 7.13 | Client-side routing with search param support |
| [lucide-react](https://lucide.dev/) | 0.577 | Icon library |
| GitHub Pages | — | Static hosting via GitHub Actions |

### Architecture Decisions

- **No backend.** All content is static TypeScript data, deployable as a pure SPA. No API, no database, no CMS. Content lives in `src/data/content.ts` as typed objects — this means the TypeScript compiler catches broken cross-references, missing fields, and schema violations at build time.
- **Dark theme only.** Optimized for extended reading sessions. CSS custom properties (`--bg`, `--text`, `--accent`, etc.) defined in `index.css`.
- **Inline styles over CSS modules.** Components use `style` props for layout and theming. This keeps component logic and presentation co-located and avoids class name coordination across files.
- **Content as code.** Every lesson, quiz, pathway, tweet, agent role, and pipeline stage is a TypeScript object conforming to interfaces in `types.ts`. Adding content means adding data, not writing JSX.

### Build Output

- **Bundle:** ~457 KB JS / ~144 KB gzipped
- **CSS:** ~2.4 KB
- **Build time:** <500ms (Vite 8 + Rolldown)

## Site Structure

### Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, pathway cards, layer explainer, featured concepts, pipeline preview |
| `/browse` | Browse | Search and filter all 30 content nodes by text, difficulty, and type |
| `/lesson/:id` | Lesson | Individual lesson with 5-layer progressive disclosure, quiz, and pathway nav |
| `/pathways` | Pathways | All learning pathways organized by persona |
| `/pathway/:id` | Pathway Detail | Ordered lesson sequence with lesson-to-lesson navigation |
| `/tweets` | Tweets | Tweet swarm content organized by series (10 series, 150+ tweets) |
| `/pipeline` | Pipeline | Interactive 8-stage pipeline diagram with agent swarm architecture |
| `*` | 404 | Catch-all with navigation back to home |

### Content Model

Every lesson is a `ContentNode` with:

```typescript
interface ContentNode {
  id: string;              // URL slug and cross-reference key
  title: string;
  type: NodeType;          // concept | lesson | project | puzzle | quiz | theory | example | tool
  summary: string;
  difficulty: Difficulty;  // beginner | intermediate | advanced | expert
  layers: {
    intuition?: string;    // Plain-language, no jargon
    system?: string;       // Architectural context
    technical?: string;    // Code and implementation
    project?: string;      // Build exercises
    theory?: string;       // CS/stats/design theory
  };
  prerequisites: string[];   // Dependency graph
  relatedNodes: string[];    // Cross-references
  tags: string[];            // Faceted browsing
  personaFit: Persona[];     // Who this is written for
  quizItems?: QuizItem[];    // Interactive assessment
  unlocks?: string[];        // What this enables
  visual?: VisualSpec;       // Suggested diagram type
}
```

### Progressive Disclosure (5 Layers)

The core UX principle. Every concept has five depth levels, controlled by tabs in the lesson view:

1. **Intuition** — Everyday scenarios and concrete examples. No jargon, no code. Designed to build mental models before formalism.
2. **System** — How this concept fits into the larger architecture. Data flows, integration points, upstream/downstream dependencies.
3. **Technical** — Code-level implementation. Algorithms, data structures, TypeScript patterns, function signatures.
4. **Build Guide** — Step-by-step instructions for building a working implementation you can test.
5. **Foundations** — The CS, statistics, and design theory behind the practical work. Academic grounding for the intuitions.

### Learning Pathways

| Pathway | Persona | Lessons | Difficulty | Focus |
|---------|---------|---------|------------|-------|
| The Drafter's Data Edge | MTG Player | 8 | Beginner | Signals, win rates, 17Lands data, archetype detection |
| Building a Data Pipeline from Scratch | Developer | 14 | Intermediate | Log parsing, state machines, event emitters, overlay rendering |
| Exploring a New Domain with Data | Data Scientist | 10 | Intermediate | Feature engineering, experimental design, statistical reasoning |
| The Gentle Introduction | Curious Beginner | 12 | Beginner | Narrative-first, analogy-heavy, builds gradually to technical |
| AI Engineering Through a Real System | AI Engineer | 10 | Advanced | Deterministic/probabilistic boundary, tool-calling, agent swarms |

### Components

| Component | Purpose |
|-----------|---------|
| `LayerContent` | Renders layer text with paragraph breaks and inline `code` formatting |
| `LayerTabs` | 5-tab switcher for progressive disclosure layers |
| `LessonCard` | Compact card with title, difficulty badge, summary, tags |
| `QuizCard` | Multi-question interactive quiz with explanations |
| `PipelineDiagram` | 8-stage interactive pipeline visualization |
| `AgentCard` | Agent role display (name, inputs, outputs, deterministic flag) |
| `SearchFilter` | Text search + difficulty/type dropdown filters |
| `PathwayCard` | Pathway overview with persona, difficulty, lesson count |
| `Header` | Site-wide navigation bar |

## Design and Development Process

### Origins

The project began with two long-form design documents (GPT.txt and GPT2.txt, ~1,400 lines combined) that articulated a vision: teach real computer science through a working MTG draft analysis pipeline. The core thesis was that **LLMs are analysts, deterministic software is infrastructure, and both are needed** to solve complex analysis problems reliably.

### Architecture Planning

The design documents were converted into an action-mapped architecture plan (`GPT2-architecture-plan.md`) that decomposed the vision into:

- **7 learning modules** covering deterministic engineering, agentic swarms, the LLM-as-analyst pattern, pipeline architecture, failure modes, data provenance, and mini CS lessons
- **11 agent roles** spanning the full pipeline from input routing to export generation
- **8 pipeline stages** (Input → Parse → Normalize → Validate → Enrich → Reason → Explain → Export)
- **Content taxonomy** with difficulty levels, persona targeting, prerequisite graphs, and visual specifications

### Implementation

The site was built iteratively with Claude Code assistance:

1. **Data model first.** TypeScript interfaces (`types.ts`) defined before any components. The type system enforces content integrity — every cross-reference, every prerequisite chain, every quiz answer is type-checked.

2. **Content authoring.** 30 content nodes written across all 5 layers. Each node's intuition layer was crafted to avoid repetitive patterns (no "Imagine..." or "Think about..." openings — each uses a distinct rhetorical technique: leading with a question, a contradiction, a provocation, or a concrete scenario).

3. **Component development.** Presentational components built to the data model. The `LayerContent` component handles paragraph splitting (on `\n\n` or sentence boundaries) and inline code rendering (backtick detection).

4. **Pathway design.** Five persona-based pathways with curated lesson sequences. Pathway context propagates through URL search params (`?pathway=mtg-player-path`) so lessons show position indicators and prev/next navigation.

5. **Writing critique and revision.** The entire site underwent a structured writing critique (using the Isidore critique methodology) that identified 12 issues. All were addressed: hero copy was sharpened, statistical claims were softened, intuition openings were varied, quizzes were added to unquizzed lessons, pathways were trimmed for persona coherence, and a 404 page was added.

### Content Quality Principles

- **No hedging in intuition layers.** Concrete scenarios, not "Imagine you might consider..."
- **Varied openings.** Each lesson starts with a different rhetorical device: question, fact, provocation, contradiction, or concrete scenario.
- **Honest claims.** Statistical assertions are qualified ("most commonly cited metric" rather than "single most useful metric").
- **Persona coherence.** Each pathway includes only lessons relevant to its target audience. The MTG Player path doesn't include pedagogy lessons; the Data Scientist path doesn't include narrative design.
- **Quiz coverage.** Every lesson has at least one quiz item with explanations that teach, not just evaluate.

## Data Files

```
src/data/
  types.ts      — TypeScript interfaces for all content structures
  content.ts    — 30 content nodes, 5 pathways, 11 agent roles, 8 pipeline stages
  tweets.ts     — 10 tweet series with 150+ individual tweets
```

## Deployment

The site deploys automatically to GitHub Pages on every push to `main` via GitHub Actions. The workflow:

1. Checks out code
2. Installs dependencies (`npm ci`)
3. Builds (`tsc -b && vite build`)
4. Uploads `dist/` as a Pages artifact
5. Deploys to `https://t3dy.github.io/draft-academy/`

## Local Development

```bash
npm install        # Install dependencies
npm run dev        # Start dev server (HMR enabled)
npm run build      # Type-check + production build
npm run preview    # Preview production build locally
npm run lint       # ESLint
```

## Adding Content

To add a new lesson:

1. Add a `ContentNode` object to `contentNodes` in `src/data/content.ts`
2. Fill all 5 layers (intuition, system, technical, project, theory)
3. Add `quizItems` with at least one question
4. Set `prerequisites` and `relatedNodes` for graph connectivity
5. Reference its `id` in relevant pathways' `nodeIds` arrays
6. The site automatically picks it up in Browse, search, and pathway views

## License

MIT
