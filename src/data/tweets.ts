export interface Tweet {
  id: string;
  text: string;
  threadGroup?: string;
  visualNote?: string;
}

export interface TweetSeries {
  id: string;
  title: string;
  premise: string;
  tweets: Tweet[];
  visualNotes: string;
  websiteLinks: string[];
}

export const tweetSeries: TweetSeries[] = [
  // ── 1. signals-as-data ──────────────────────────────────────────────
  {
    id: "signals-as-data",
    title: "Signals as Data",
    premise:
      "Every draft pick is a data point. Win rates, color signals, archetype support — none of it matters until you can capture, store, and query it.",
    visualNotes:
      "Use screenshots of 17Lands card data tables, pack 1 pick 1 scenarios, and GIH WR% column highlights.",
    websiteLinks: [
      "https://www.17lands.com/card_ratings",
      "https://scryfall.com/docs/api",
    ],
    tweets: [
      {
        id: "sad-1",
        text: "You open Pack 1 and see 15 cards. You have about 40 seconds. Your brain is doing pattern matching. But the signal you're reacting to — can you write it down?",
        threadGroup: "the-signal-problem",
      },
      {
        id: "sad-2",
        text: "A draft pick is a tiny data record: timestamp, pack number, pick number, cards available, card chosen. That's it. Five fields. But those five fields power everything 17Lands does.",
        threadGroup: "the-signal-problem",
      },
      {
        id: "sad-3",
        text: "17Lands doesn't guess which card is best. It counts. Across millions of drafts, it measures how often each card appeared in winning decks. That's GIH WR% — Games in Hand Win Rate.",
        threadGroup: "the-signal-problem",
      },
      {
        id: "sad-4",
        text: "GIH WR% of 57% means: when this card was drawn, the player won 57% of the time. That's not opinion. That's a measurement. The difference matters.",
      },
      {
        id: "sad-5",
        text: "Color signals are data too. If you see a strong red card pick 4, it means the two players to your right probably aren't drafting red. That's inference from observed data, not a hunch.",
        threadGroup: "signals-are-queryable",
      },
      {
        id: "sad-6",
        text: "But here's the problem: signals disappear. The pack moves on, the pick is made, the game ends. If you didn't capture the data, the signal is gone forever.",
        threadGroup: "signals-are-queryable",
      },
      {
        id: "sad-7",
        text: "MTGA logs every draft event to a file called Player.log. Every card in every pack. Every pick. The data is there. It's just buried in thousands of lines of JSON.",
        threadGroup: "signals-are-queryable",
      },
      {
        id: "sad-8",
        text: "Here's a question only data can answer: 'In Murders at Karlov Manor, is the best white common better than the best red uncommon?' Without GIH WR%, you're just arguing.",
      },
      {
        id: "sad-9",
        text: "Sierkovitz publishes tier lists derived from 17Lands data. Sam Black writes set reviews informed by it. The analysts aren't guessing — they're querying.",
      },
      {
        id: "sad-10",
        text: "The gap between 'I have a feeling about this format' and 'I can show you the numbers' is the gap between intuition and engineering. Both matter. But only one is reproducible.",
        threadGroup: "capture-first",
      },
      {
        id: "sad-11",
        text: "Step zero is always capture. You can't analyze what you didn't record. You can't query what you didn't store. You can't share what you didn't structure.",
        threadGroup: "capture-first",
      },
      {
        id: "sad-12",
        text: "Every draft you play generates data. The question is whether you're going to let it vanish, or turn it into something you can learn from.",
        threadGroup: "capture-first",
      },
    ],
  },

  // ── 2. parsing-game-states ──────────────────────────────────────────
  {
    id: "parsing-game-states",
    title: "Parsing Game States",
    premise:
      "MTGA writes thousands of log lines per session. Buried in there: the 15 cards you're choosing from. Finding them requires a streaming parser that counts braces and tracks string state.",
    visualNotes:
      "Show raw Player.log snippets, brace-depth diagrams, and streaming parser state transitions.",
    websiteLinks: [
      "https://mtgarena-support.wizards.com/hc/en-us/articles/360000726823",
    ],
    tweets: [
      {
        id: "pgs-1",
        text: "Open MTGA's Player.log file during a draft. It's thousands of lines. Somewhere in there is a JSON payload containing exactly the 15 card IDs in your current pack.",
        threadGroup: "the-log-problem",
      },
      {
        id: "pgs-2",
        text: "The payload isn't on one line. It's split across many. Standard JSON.parse() won't work because you don't know where the object starts or ends. You need a streaming parser.",
        threadGroup: "the-log-problem",
      },
      {
        id: "pgs-3",
        text: "A streaming JSON extractor reads one character at a time. It counts opening braces. It counts closing braces. When depth returns to zero, you have a complete object.",
        threadGroup: "the-log-problem",
      },
      {
        id: "pgs-4",
        text: "But you can't just count braces. A brace inside a string literal isn't structural. So you also need to track: am I inside a string right now? Did I just see a backslash?",
        threadGroup: "brace-depth",
      },
      {
        id: "pgs-5",
        text: "Three state variables: braceDepth (number), inString (boolean), escaped (boolean). That's all you need to extract valid JSON objects from an arbitrary text stream.",
        threadGroup: "brace-depth",
      },
      {
        id: "pgs-6",
        text: "When you encounter '{' and inString is false: braceDepth++. When you encounter '}' and inString is false: braceDepth--. When braceDepth hits 0: emit the buffer.",
        threadGroup: "brace-depth",
      },
      {
        id: "pgs-7",
        text: "When you encounter '\"' and escaped is false: toggle inString. When you encounter '\\\\' and inString is true: set escaped to true for one character. That handles nested quotes.",
        threadGroup: "brace-depth",
      },
      {
        id: "pgs-8",
        text: "This is a state machine. Not the theoretical kind from CS textbooks — the practical kind that solves a real problem: extracting structured data from a messy stream.",
      },
      {
        id: "pgs-9",
        text: "The extracted JSON contains an array of numbers like [81243, 81197, 81302...]. Those are grpIds — Arena's internal card identifiers. They're useless without a lookup table.",
        threadGroup: "identity-resolution",
      },
      {
        id: "pgs-10",
        text: "Identity resolution: grpId 81243 → 'Aurelia's Vindicator'. You need a mapping. Scryfall provides one. Import it into SQLite, and now you can join IDs to names.",
        threadGroup: "identity-resolution",
      },
      {
        id: "pgs-11",
        text: "The pipeline so far: raw log → streaming extractor → JSON objects → filter for draft events → extract grpId arrays → resolve to card names. Each stage is deterministic.",
        threadGroup: "identity-resolution",
      },
      {
        id: "pgs-12",
        text: "No machine learning. No LLMs. No fuzzy matching. Just character-by-character parsing, brace counting, and table lookups. Sometimes the right tool is a for loop.",
      },
      {
        id: "pgs-13",
        text: "The log file is append-only. New events appear at the bottom. A file watcher (fs.watch or chokidar) detects changes and feeds new bytes into the streaming parser.",
      },
      {
        id: "pgs-14",
        text: "Each draft event has a type field. 'DraftPack' means new cards to evaluate. 'DraftPick' means a selection was made. Filter on event type to find exactly what you need.",
      },
      {
        id: "pgs-15",
        text: "You've now built the first layer of a draft overlay: log monitoring → JSON extraction → event filtering → card identification. And every step is testable in isolation.",
      },
    ],
  },

  // ── 3. schemas-and-state ────────────────────────────────────────────
  {
    id: "schemas-and-state",
    title: "Schemas, Functions, Classes, and State Machines",
    premise:
      "A parser is a state machine. A draft pick is a schema. A card database is a lookup table. Name the parts, and the system becomes buildable.",
    visualNotes:
      "Type definition screenshots, state machine diagrams, class hierarchy sketches.",
    websiteLinks: [],
    tweets: [
      {
        id: "sas-1",
        text: "A schema is a contract. It says: 'A DraftPack has a packNumber (number), pickNumber (number), and cardIds (number array).' If the data doesn't match, reject it.",
        threadGroup: "schemas-are-contracts",
      },
      {
        id: "sas-2",
        text: "In TypeScript: interface DraftPack { packNumber: number; pickNumber: number; cardIds: number[]; }. That's not boilerplate. That's a machine-readable specification.",
        threadGroup: "schemas-are-contracts",
      },
      {
        id: "sas-3",
        text: "Zod lets you validate at runtime what TypeScript checks at compile time. z.object({ packNumber: z.number(), cardIds: z.array(z.number()) }). Parse, don't guess.",
        threadGroup: "schemas-are-contracts",
      },
      {
        id: "sas-4",
        text: "A function takes input and returns output. A pure function always returns the same output for the same input. resolveCardName(81243) always returns 'Aurelia's Vindicator'.",
        threadGroup: "functions-and-purity",
      },
      {
        id: "sas-5",
        text: "Side effects are where bugs hide. Reading from a file: side effect. Writing to a database: side effect. Looking up a card name from an in-memory Map: pure.",
        threadGroup: "functions-and-purity",
      },
      {
        id: "sas-6",
        text: "Push side effects to the edges. The parser core is pure: character in, state out. File I/O happens at the boundary. This makes the core testable without touching the filesystem.",
        threadGroup: "functions-and-purity",
      },
      {
        id: "sas-7",
        text: "A class groups data and behavior. A CardDatabase class holds the SQLite connection and exposes lookupByGrpId(). The caller doesn't know or care that it's SQL underneath.",
      },
      {
        id: "sas-8",
        text: "Encapsulation isn't about hiding things to be secretive. It's about giving each part of the system one job and a clean interface. The parser doesn't need to know about card names.",
        threadGroup: "state-machines",
      },
      {
        id: "sas-9",
        text: "A state machine has states and transitions. The brace-counting parser has states: IDLE, IN_OBJECT, IN_STRING, ESCAPED. Transitions are triggered by the next character.",
        threadGroup: "state-machines",
      },
      {
        id: "sas-10",
        text: "State machines make illegal states unrepresentable. You can't be ESCAPED and not IN_STRING. You can't be IN_OBJECT with braceDepth zero. The types enforce the invariants.",
        threadGroup: "state-machines",
      },
      {
        id: "sas-11",
        text: "EventEmitter connects pipeline stages. The parser emits 'json-object'. The filter listens, checks the type, and emits 'draft-pack'. The resolver listens and emits 'cards-resolved'.",
        threadGroup: "event-architecture",
      },
      {
        id: "sas-12",
        text: "Each stage subscribes to the previous stage's events. Stages don't import each other. They communicate through a shared event bus. Loose coupling, clear contracts.",
        threadGroup: "event-architecture",
      },
      {
        id: "sas-13",
        text: "parser.on('json-object', obj => filter.process(obj)). filter.on('draft-pack', pack => resolver.resolve(pack)). Three lines. Three stages connected. The architecture is visible.",
        threadGroup: "event-architecture",
      },
      {
        id: "sas-14",
        text: "Naming matters. 'data' is meaningless. 'rawLogChunk' tells you what it is. 'resolvedDraftPack' tells you what happened to it. Good names are free documentation.",
      },
      {
        id: "sas-15",
        text: "Every technical concept here — schema, function, class, state machine, event emitter — exists because someone needed to manage complexity. They're tools, not theory.",
      },
    ],
  },

  // ── 4. deterministic-vs-llm ─────────────────────────────────────────
  {
    id: "deterministic-vs-llm",
    title: "Deterministic Systems vs LLMs",
    premise:
      "Some questions have exact answers (what's the win rate of this card?). Some need interpretation (is this the right pick given my draft?). Know which tool handles which.",
    visualNotes:
      "Split-screen diagrams: deterministic pipeline on left, LLM reasoning on right. Decision boundary illustrations.",
    websiteLinks: [],
    tweets: [
      {
        id: "dvl-1",
        text: "'What is the GIH WR% of Aurelia's Vindicator in premier draft?' That's a database query. SELECT gih_wr FROM cards WHERE name = 'Aurelia''s Vindicator'. Exact answer. No LLM needed.",
        threadGroup: "exact-vs-interpretive",
      },
      {
        id: "dvl-2",
        text: "'Should I take Aurelia's Vindicator here or stay in black-green?' That requires context: what you've drafted, what signals you've seen, your skill level. That's interpretation.",
        threadGroup: "exact-vs-interpretive",
      },
      {
        id: "dvl-3",
        text: "The first question is deterministic. The second is probabilistic. Using an LLM for the first is wasteful. Using a SQL query for the second is impossible.",
        threadGroup: "exact-vs-interpretive",
      },
      {
        id: "dvl-4",
        text: "Rule: if the answer is a number in a table, use deterministic tooling. If the answer requires weighing tradeoffs in context, that's where LLMs earn their keep.",
      },
      {
        id: "dvl-5",
        text: "A deterministic pipeline can say: 'These 15 cards have these win rates, these color distributions, these synergy scores.' It can't say: 'You should pivot into red here.'",
        threadGroup: "the-handoff",
      },
      {
        id: "dvl-6",
        text: "An LLM can reason about the pivot. But only if you give it the structured data first. The pipeline feeds the model. The model interprets the pipeline's output.",
        threadGroup: "the-handoff",
      },
      {
        id: "dvl-7",
        text: "This is the architecture: deterministic extraction → structured data → LLM interpretation → human decision. Four stages. Each does what it's best at.",
        threadGroup: "the-handoff",
      },
      {
        id: "dvl-8",
        text: "Tool-calling lets the LLM invoke deterministic functions. 'What's the win rate of this card?' The model calls getWinRate(cardName), gets 0.57, and uses it in its reasoning.",
        threadGroup: "tool-calling",
      },
      {
        id: "dvl-9",
        text: "The LLM doesn't memorize win rates. It doesn't need to. It calls a tool that queries a database that was populated from 17Lands CSV data. Each layer does its job.",
        threadGroup: "tool-calling",
      },
      {
        id: "dvl-10",
        text: "Tool-calling is the bridge between deterministic and probabilistic. The model decides what to ask. The tool provides exact answers. The model synthesizes.",
        threadGroup: "tool-calling",
      },
      {
        id: "dvl-11",
        text: "If you put card win rates in the system prompt, they're stale the moment a new set drops. If you put them in a database the model can query, they're always current.",
      },
      {
        id: "dvl-12",
        text: "Hallucination risk: an LLM might say a card has 55% win rate when it's actually 49%. The fix isn't 'better prompting.' The fix is: don't ask the LLM for the number.",
        threadGroup: "trust-boundaries",
      },
      {
        id: "dvl-13",
        text: "Trust boundaries: trust the database for facts. Trust the parser for extraction. Trust the LLM for synthesis and explanation. Never trust any layer for another's job.",
        threadGroup: "trust-boundaries",
      },
      {
        id: "dvl-14",
        text: "The best AI systems aren't all-LLM. They're hybrids. Deterministic where you can be. Probabilistic where you must be. The art is knowing the boundary.",
        threadGroup: "trust-boundaries",
      },
    ],
  },

  // ── 5. thinking-tools ───────────────────────────────────────────────
  {
    id: "thinking-tools",
    title: "SQL, TypeScript, and Markdown as Thinking Tools",
    premise:
      "These aren't just languages. They're thinking tools. SQL is how you ask questions about data. TypeScript is how you describe the shape of things. Markdown is how you explain what you built.",
    visualNotes:
      "Side-by-side: a question in English, the same question in SQL. A concept described in prose, then as a TypeScript interface.",
    websiteLinks: [],
    tweets: [
      {
        id: "tt-1",
        text: "'Which white commons in MKM have a GIH WR% above 55%?' That's a question. SELECT name, gih_wr FROM cards WHERE color='W' AND rarity='C' AND gih_wr > 0.55. That's the same question in SQL.",
        threadGroup: "sql-as-questions",
      },
      {
        id: "tt-2",
        text: "SQL doesn't compute. It queries. You describe what you want, not how to get it. 'Give me all red uncommons sorted by win rate.' The engine figures out the how.",
        threadGroup: "sql-as-questions",
      },
      {
        id: "tt-3",
        text: "GROUP BY color, rarity tells you the average win rate per color-rarity bucket. One line. No loops, no accumulators. The question is the code.",
        threadGroup: "sql-as-questions",
      },
      {
        id: "tt-4",
        text: "JOIN cards ON cards.name = ratings.name connects your Scryfall data to your 17Lands data. Two tables become one view. That's the power of relational thinking.",
        threadGroup: "sql-as-questions",
      },
      {
        id: "tt-5",
        text: "TypeScript isn't about catching typos. It's about describing the shape of your data so precisely that entire categories of bugs become impossible.",
        threadGroup: "typescript-as-shapes",
      },
      {
        id: "tt-6",
        text: "type DraftPhase = 'pack1' | 'pack2' | 'pack3'. Now the compiler knows there's no 'pack4'. You encoded a rule of Magic into the type system. The machine enforces it for you.",
        threadGroup: "typescript-as-shapes",
      },
      {
        id: "tt-7",
        text: "interface CardRating { name: string; gihWr: number; ohWr: number; gdWr: number; }. That's not just a type — it's documentation. Anyone reading it knows what a card rating contains.",
        threadGroup: "typescript-as-shapes",
      },
      {
        id: "tt-8",
        text: "Discriminated unions: type LogEvent = { type: 'draft-pack'; cards: number[] } | { type: 'draft-pick'; cardId: number }. Now a switch on event.type gives you exhaustive checking.",
        threadGroup: "typescript-as-shapes",
      },
      {
        id: "tt-9",
        text: "Markdown is how you explain what you built to your future self. A README that says 'run npm start' saves you 20 minutes of archaeology six months from now.",
        threadGroup: "markdown-as-explanation",
      },
      {
        id: "tt-10",
        text: "A well-structured Markdown doc mirrors the architecture: ## Parsing, ## Identity Resolution, ## Overlay Rendering. The headings are the system boundaries.",
        threadGroup: "markdown-as-explanation",
      },
      {
        id: "tt-11",
        text: "Code comments say what. Markdown docs say why. 'We use SQLite instead of Postgres because the database ships with the overlay and needs zero configuration.'",
        threadGroup: "markdown-as-explanation",
      },
      {
        id: "tt-12",
        text: "Three languages, three modes of thought. SQL: asking. TypeScript: describing. Markdown: explaining. A working engineer uses all three, often in the same hour.",
      },
    ],
  },

  // ── 6. learning-hard-things ─────────────────────────────────────────
  {
    id: "learning-hard-things",
    title: "How to Learn Hard Technical Ideas Without Drowning",
    premise:
      "You don't need to understand everything before you start. You need to understand the next thing.",
    visualNotes:
      "Learning curve diagrams, zone of proximal development illustrations, before/after comprehension snapshots.",
    websiteLinks: [],
    tweets: [
      {
        id: "lht-1",
        text: "You don't learn to parse JSON by reading the JSON spec. You learn by having a broken log file and needing to extract one field from it. The problem teaches the concept.",
        threadGroup: "problem-first",
      },
      {
        id: "lht-2",
        text: "State machines sound academic until you need to track whether a quote character is inside a string or ending one. Then it's the most practical idea in the world.",
        threadGroup: "problem-first",
      },
      {
        id: "lht-3",
        text: "Every concept in computer science was invented because someone had a problem. Find the problem first. The concept will make sense when you need it.",
        threadGroup: "problem-first",
      },
      {
        id: "lht-4",
        text: "Don't read the whole TypeScript handbook. Write one interface for a draft pack. You'll learn generics when you need a function that works on both packs and picks.",
      },
      {
        id: "lht-5",
        text: "Confusion is information. If you're confused about SQL JOINs, that means JOINs are the next thing to learn. Not indexes. Not query optimization. JOINs.",
        threadGroup: "confusion-is-signal",
      },
      {
        id: "lht-6",
        text: "The zone of proximal development: the space between what you can do alone and what you can do with help. Stay in that zone. Too easy is boring. Too hard is paralyzing.",
        threadGroup: "confusion-is-signal",
      },
      {
        id: "lht-7",
        text: "When you hit a wall, shrink the problem. Can't build the whole overlay? Can you read one line from the log? Can you count braces in a string? Start there.",
        threadGroup: "confusion-is-signal",
      },
      {
        id: "lht-8",
        text: "Tutorials teach you to follow steps. Projects teach you to solve problems. The difference: in a project, nobody tells you which step is next.",
        threadGroup: "projects-over-tutorials",
      },
      {
        id: "lht-9",
        text: "Build the draft log parser. Not because it's a tutorial exercise, but because you actually want to see your draft data. Motivation beats curriculum every time.",
        threadGroup: "projects-over-tutorials",
      },
      {
        id: "lht-10",
        text: "You'll google things constantly. That's not cheating. That's engineering. The skill isn't memorizing syntax — it's knowing what question to ask.",
        threadGroup: "projects-over-tutorials",
      },
      {
        id: "lht-11",
        text: "Re-reading doesn't work. Re-doing works. You understand the streaming parser when you've written one, broken it, fixed it, and extended it. Not when you've read about one.",
      },
      {
        id: "lht-12",
        text: "Give yourself permission to not understand yet. 'I don't get EventEmitters yet' is fine. You will. The draft overlay project will make sure of it.",
      },
      {
        id: "lht-13",
        text: "The fastest way to learn a database is to have data you care about. Card win rates you want to query. Draft picks you want to analyze. Caring is the accelerant.",
      },
      {
        id: "lht-14",
        text: "You don't need to be good at math to do data science. You need to count things, compare things, and notice when a number surprises you. 17Lands data gives you all three.",
      },
    ],
  },

  // ── 7. mtg-lab ──────────────────────────────────────────────────────
  {
    id: "mtg-lab",
    title: "MTG Draft as a Data Science Laboratory",
    premise:
      "17Lands has millions of draft records. Each one is a natural experiment. This is a real dataset with real stakes and real complexity.",
    visualNotes:
      "17Lands data tables, distribution histograms of win rates, color-pair performance charts.",
    websiteLinks: [
      "https://www.17lands.com/public_datasets",
      "https://www.17lands.com/card_ratings",
    ],
    tweets: [
      {
        id: "ml-1",
        text: "17Lands has logged over 20 million games of Magic. Each game has a draft portion (what was picked) and a game portion (what happened). That's a dataset most fields would envy.",
        threadGroup: "the-dataset",
      },
      {
        id: "ml-2",
        text: "Every draft is a natural experiment. 8 players, 3 packs, 45 picks each. Different players see different cards and make different choices. The outcomes are measurable.",
        threadGroup: "the-dataset",
      },
      {
        id: "ml-3",
        text: "The 17Lands CSV has columns like name, color, rarity, gih_wr, oh_wr, gd_wr, iwd. Each one answers a different question about how a card performs.",
        threadGroup: "the-dataset",
      },
      {
        id: "ml-4",
        text: "GIH WR% = Games in Hand Win Rate. How often do you win when you've drawn this card? OH WR% = Opening Hand. GD WR% = Game Drawn. Different windows, different stories.",
      },
      {
        id: "ml-5",
        text: "IWD = Improvement When Drawn. How much better is your win rate when you draw this card vs. when you don't? High IWD means the card actively wins games, not just shows up in winning decks.",
        threadGroup: "feature-engineering",
      },
      {
        id: "ml-6",
        text: "ALSA = Average Last Seen At. If a card's ALSA is 2.1, it almost never gets past pick 2. If it's 8.5, it wheels regularly. ALSA is a proxy for how much other drafters want a card.",
        threadGroup: "feature-engineering",
      },
      {
        id: "ml-7",
        text: "Feature engineering: ALSA minus expected pick position based on win rate. Cards underdrafted relative to their power level? That's a market inefficiency. That's an edge.",
        threadGroup: "feature-engineering",
      },
      {
        id: "ml-8",
        text: "Sample size matters. A card with 60% GIH WR from 200 games is noise. The same stat from 20,000 games is signal. Always check the games_played column.",
        threadGroup: "feature-engineering",
      },
      {
        id: "ml-9",
        text: "Color pair analysis: what's the average GIH WR of all white-blue cards vs. all red-green cards? GROUP BY color_pair, compute the mean. You just measured the format's metagame.",
        threadGroup: "real-analysis",
      },
      {
        id: "ml-10",
        text: "Distribution matters more than averages. A color pair where all cards are 50-52% plays differently than one with some at 45% and others at 58%. Variance is information.",
        threadGroup: "real-analysis",
      },
      {
        id: "ml-11",
        text: "Week-over-week win rate changes show format evolution. A card at 53% week 1 and 48% week 4 means the metagame adapted. The data captures learning in real time.",
        threadGroup: "real-analysis",
      },
      {
        id: "ml-12",
        text: "This isn't a toy dataset. It has selection bias (better players use 17Lands), survivorship bias (you only see drawn cards), and confounders. Real data science means grappling with that.",
      },
      {
        id: "ml-13",
        text: "A card might have high GIH WR not because it's good, but because it only goes in decks that are already good. Teasing apart causation from correlation — that's the real exercise.",
      },
      {
        id: "ml-14",
        text: "You could spend a career analyzing this data and not exhaust it. That's not a limitation. That's the point. A living dataset with new sets every quarter.",
      },
    ],
  },

  // ── 8. building-tools ───────────────────────────────────────────────
  {
    id: "building-tools",
    title: "Building Tools for Analysts",
    premise:
      "Sierkovitz and Sam Black don't need another hot take. They need queryable data, reproducible pipelines, and tools that respect their expertise.",
    visualNotes:
      "CLI tool screenshots, pipeline architecture diagrams, analyst workflow comparisons.",
    websiteLinks: [],
    tweets: [
      {
        id: "bt-1",
        text: "The best draft analysts already know what questions to ask. What they lack isn't insight — it's infrastructure. Queryable data. Reproducible pipelines. Stable tooling.",
        threadGroup: "analyst-needs",
      },
      {
        id: "bt-2",
        text: "Sierkovitz manually downloads CSVs, opens spreadsheets, and writes formulas. That works. But what if the CSV import, the cleaning, and the initial queries were automated?",
        threadGroup: "analyst-needs",
      },
      {
        id: "bt-3",
        text: "A tool for an analyst isn't an AI that gives answers. It's a pipeline that prepares data so the analyst can ask better questions faster.",
        threadGroup: "analyst-needs",
      },
      {
        id: "bt-4",
        text: "Three prior overlay projects each solved one layer. One parsed logs. One resolved card IDs. One drew overlays. None integrated the full pipeline. That's the engineering gap.",
        threadGroup: "integration-gap",
      },
      {
        id: "bt-5",
        text: "The integration order matters: extraction → identity → overlay → visual features. Skip identity resolution and your overlay shows grpId 81243 instead of a card name.",
        threadGroup: "integration-gap",
      },
      {
        id: "bt-6",
        text: "A slot-aligned coordinate system maps card positions to screen regions without pixel detection. Pack slot 1 is always at the same relative position. Geometry, not computer vision.",
        threadGroup: "integration-gap",
      },
      {
        id: "bt-7",
        text: "Reproducibility: given the same Player.log and the same 17Lands CSV, the tool should produce the exact same output every time. No randomness. No API-dependent variation.",
        threadGroup: "tool-principles",
      },
      {
        id: "bt-8",
        text: "Respect the analyst's expertise. Don't auto-recommend picks. Show the data — win rates, color distribution, archetype signals — and let the expert decide.",
        threadGroup: "tool-principles",
      },
      {
        id: "bt-9",
        text: "A good CLI tool: `draft-tool import --csv 17lands-mkm.csv --db cards.db`. Clear inputs, clear outputs, no hidden state. The analyst can script it.",
        threadGroup: "tool-principles",
      },
      {
        id: "bt-10",
        text: "Error messages matter. 'Error: unknown card' is useless. 'Error: grpId 81243 not found in Scryfall data (last updated 2024-01-15). Run `draft-tool update-cards` to refresh.' That's a tool.",
      },
      {
        id: "bt-11",
        text: "The overlay shows win rate data next to each card in the pack. Not below. Not in a sidebar. Next to the card, in the slot where your eyes already are.",
      },
      {
        id: "bt-12",
        text: "Feature flags: --show-gih-wr, --show-color-signal, --show-archetype-fit. Let the analyst choose what data appears. Don't assume you know what they need.",
      },
      {
        id: "bt-13",
        text: "Build for the power user. If Sierkovitz can't get value from your tool in 30 seconds, your tool isn't good enough. Expert time is the constraint you're optimizing for.",
      },
    ],
  },

  // ── 9. narrative-design ─────────────────────────────────────────────
  {
    id: "narrative-design",
    title: "Narrative Design for Technical Learning",
    premise:
      "The order you encounter ideas matters as much as the ideas themselves. Good technical education is a designed experience, not a data dump.",
    visualNotes:
      "Curriculum flow diagrams, concept dependency graphs, before/after learning path comparisons.",
    websiteLinks: [],
    tweets: [
      {
        id: "nd-1",
        text: "Most technical courses dump all the concepts on you in week one. 'Here's SQL, TypeScript, APIs, state machines, and event systems. Good luck.' That's not teaching. That's a parts list.",
        threadGroup: "sequence-matters",
      },
      {
        id: "nd-2",
        text: "Narrative design: the player encounters a locked door before they find the key. In learning: you feel the pain of reading raw log files before you learn about parsers.",
        threadGroup: "sequence-matters",
      },
      {
        id: "nd-3",
        text: "The order is: motivation → concrete example → abstraction → practice. Not: definition → proof → exercise. Start with the draft pack, not the JSON spec.",
        threadGroup: "sequence-matters",
      },
      {
        id: "nd-4",
        text: "Why MTG draft? Because it has real stakes (winning and losing), real data (17Lands), and real complexity (45 picks, 8 players, hidden information). Toy examples don't motivate.",
      },
      {
        id: "nd-5",
        text: "A concept should arrive at the moment the learner needs it. Teach SQL when the learner has data they want to query. Not before. Not after. At the moment of need.",
        threadGroup: "just-in-time",
      },
      {
        id: "nd-6",
        text: "The streaming parser lesson works because the student already tried JSON.parse() on the log file and watched it fail. The failure creates the question. The lesson answers it.",
        threadGroup: "just-in-time",
      },
      {
        id: "nd-7",
        text: "Callbacks before promises. Promises before async/await. Each one solves a problem with the previous one. The narrative is: 'This works, but here's why it's painful. Now try this.'",
        threadGroup: "just-in-time",
      },
      {
        id: "nd-8",
        text: "Technical stories need villains. The villain is complexity. The villain is 'I can see the data but I can't reach it.' Every tool you build defeats a specific villain.",
        threadGroup: "story-structure",
      },
      {
        id: "nd-9",
        text: "The hero's journey for a developer: encounter a problem → struggle with inadequate tools → discover the right abstraction → build the solution → reflect on what you learned.",
        threadGroup: "story-structure",
      },
      {
        id: "nd-10",
        text: "Reflection is the most skipped step. 'We built a streaming parser. What did we actually learn? We learned that structure can be extracted from chaos one character at a time.'",
        threadGroup: "story-structure",
      },
      {
        id: "nd-11",
        text: "A dependency graph of concepts: parsing depends on string manipulation. Identity resolution depends on parsing + databases. Overlay depends on identity + coordinates. Teach in order.",
      },
      {
        id: "nd-12",
        text: "Every module should end with a working artifact. Not 'understanding.' An artifact. A parser that extracts JSON. A database you can query. A script that produces output.",
      },
      {
        id: "nd-13",
        text: "The narrative promise: 'By the end, you'll have a working draft overlay that shows you win rates during a live draft.' Every lesson is a step toward that promise.",
      },
      {
        id: "nd-14",
        text: "If the learner can't see how this lesson connects to the draft overlay, you've lost the thread. Every detour needs a signpost: 'We need this for the next layer.'",
      },
      {
        id: "nd-15",
        text: "Design the experience. Don't just transfer knowledge. A data dump and a designed curriculum contain the same information. Only one of them teaches.",
      },
    ],
  },

  // ── 10. progressive-disclosure ──────────────────────────────────────
  {
    id: "progressive-disclosure",
    title: "Progressive Disclosure and Quiz-Driven Pedagogy",
    premise:
      "Show the intuition first. Then the system view. Then the code. Then the project. Let the learner control depth.",
    visualNotes:
      "Expandable content UI mockups, quiz flow diagrams, depth-level comparison charts.",
    websiteLinks: [],
    tweets: [
      {
        id: "pd-1",
        text: "Progressive disclosure: don't show everything at once. Show the headline. Let the curious click deeper. 'A streaming parser extracts JSON from logs' → click → here's how brace counting works.",
        threadGroup: "layers-of-depth",
      },
      {
        id: "pd-2",
        text: "Level 1: 'Card win rates help you draft better.' Level 2: 'GIH WR% measures how often you win when a card is drawn.' Level 3: 'Here's the SQL query to calculate it.' Let the learner choose.",
        threadGroup: "layers-of-depth",
      },
      {
        id: "pd-3",
        text: "Not everyone needs the code. Some learners want the concept. Some want the implementation. Some want both. Progressive disclosure serves all three without boring any of them.",
        threadGroup: "layers-of-depth",
      },
      {
        id: "pd-4",
        text: "A quiz before the lesson measures what the learner already knows. A quiz after measures what they learned. The gap between the two is the lesson's actual impact.",
        threadGroup: "quiz-design",
      },
      {
        id: "pd-5",
        text: "Good quiz question: 'The parser encounters a \" character. inString is true, escaped is false. What happens next?' That tests understanding of the state machine, not memorization.",
        threadGroup: "quiz-design",
      },
      {
        id: "pd-6",
        text: "Bad quiz question: 'What year was JSON standardized?' That tests trivia. Nobody needs that to build a parser. Every quiz question should connect to a skill the learner will use.",
        threadGroup: "quiz-design",
      },
      {
        id: "pd-7",
        text: "Multiple choice works when the wrong answers represent common misconceptions. 'What does braceDepth === 0 mean?' Wrong answer: 'The JSON is invalid.' That catches a real misunderstanding.",
        threadGroup: "quiz-design",
      },
      {
        id: "pd-8",
        text: "Show the intuition before the formalism. 'The parser remembers how deep it is in nested braces' comes before 'Maintain an integer counter incremented on { and decremented on }.'",
      },
      {
        id: "pd-9",
        text: "Expandable code blocks: show the function signature, hide the implementation. The learner who just wants the API reads the signature. The one who wants the details expands it.",
        threadGroup: "ui-patterns",
      },
      {
        id: "pd-10",
        text: "Tabbed views: 'Concept | Code | Quiz.' Three perspectives on the same idea. The concept tab explains why. The code tab shows how. The quiz tab tests whether you got it.",
        threadGroup: "ui-patterns",
      },
      {
        id: "pd-11",
        text: "A progress bar showing 'Parsing: 3/5 concepts mastered' gives the learner a map. They know where they are, how far they've come, and what's left. Maps reduce anxiety.",
        threadGroup: "ui-patterns",
      },
      {
        id: "pd-12",
        text: "Spaced repetition: show the brace-counting concept today, quiz it tomorrow, revisit it in a week. Retention comes from retrieval practice, not from re-reading.",
      },
      {
        id: "pd-13",
        text: "The learner should never feel lost. At any point they should be able to answer: 'What am I building? What concept am I learning? How does this connect to the draft overlay?'",
      },
      {
        id: "pd-14",
        text: "Depth on demand. Breadth by default. Show the system map. Let the learner zoom into any node. The parser node expands to: brace counting → string tracking → escape handling.",
        threadGroup: "depth-on-demand",
      },
      {
        id: "pd-15",
        text: "Each zoom level is self-contained. You can understand 'the parser extracts JSON from logs' without knowing how brace counting works. You can learn brace counting without learning escape handling.",
        threadGroup: "depth-on-demand",
      },
      {
        id: "pd-16",
        text: "The learner who skips the parser internals and goes straight to SQL isn't behind. They took a different path through the same material. Multiple valid paths. One destination.",
        threadGroup: "depth-on-demand",
      },
    ],
  },
];
