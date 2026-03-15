import type { ContentNode, Pathway, AgentRole, PipelineStage } from './types';

export const contentNodes: ContentNode[] = [
  {
    id: 'signals-as-data',
    title: 'Signals as Data',
    type: 'concept',
    summary: 'Every card missing from a draft pack is a signal. Learning to treat signals as structured data transforms gut-feel drafting into a measurable discipline.',
    difficulty: 'beginner',
    layers: {
      intuition: 'You open a pack and notice the best red card is still there at pick 5. That absence of picks — the fact that four other players passed it — is a signal. Signals are not mystical; they are the observable traces of hidden decisions. Every pack you see is a partially redacted document, and the redactions themselves carry meaning. When you start treating those gaps as data points instead of vibes, drafting becomes a different game entirely.',
      system: 'A draft signal system works by recording every card seen in every pack at every pick number, then comparing what was taken against what was expected. If a premium red removal spell wheels (comes back around the table), that is strong evidence red is open. The system needs a baseline of card quality — typically derived from 17Lands GIH WR% — to distinguish between a card wheeling because it is bad and a card wheeling because nobody at the table wants its color. Signals accumulate over picks and become more reliable as the draft progresses.',
      technical: 'Implementing signal detection requires a pick-by-pick log of pack contents. MTGA provides this through the DraftPick and DraftPack log events, which include a list of grpIds for every card in the pack. By mapping grpIds to card names and associating each card with its 17Lands GIH WR%, you can compute an expected pick order. Comparing the actual pick against the expected pick yields a signal strength value. A simple heuristic: if a card with GIH WR% above 55% is still in the pack at pick 6 or later, that color is likely open.',
      project: 'Build a signal tracker that ingests draft log events and outputs a color openness score for each of the five colors. Start by parsing DraftPack events to extract the list of grpIds, then resolve each grpId to a card name and color identity. For each pack seen, compute the gap between the card\'s expected pick position (based on GIH WR%) and its actual pick position. Aggregate these gaps by color to produce a running signal strength per color. Display the result as five colored bars in your overlay.',
      theory: 'Signal theory in drafting is a special case of incomplete information games. Each player observes a partial signal (the pack they receive) and must infer the hidden state (what colors other players are drafting). This is structurally similar to the classic problem of decentralized decision-making under partial observability. The key insight from information theory is that signals are more valuable early in the draft when uncertainty is highest, and become redundant once the player\'s lane is established — a phenomenon analogous to diminishing marginal returns on information.'
    },
    prerequisites: [],
    relatedNodes: ['color-signals', 'gih-winrate', 'seventeen-lands-data', 'draft-as-experiment'],
    tags: ['draft', 'signals', 'data', 'decision-making'],
    personaFit: ['mtg-player', 'curious-beginner', 'data-scientist'],
    quizItems: [
      {
        question: 'A premium red card with 58% GIH WR% is still in the pack at pick 7. What does this most likely indicate?',
        options: [
          'The card is bad in this format',
          'Red is likely open at your seat',
          'The other drafters made a mistake',
          'You should avoid red because others will move into it'
        ],
        correctIndex: 1,
        explanation: 'A high-winrate card surviving to pick 7 strongly suggests that the players passing to you are not prioritizing red. This is a classic signal that red is open. The card\'s GIH WR% confirms it is objectively strong, ruling out the possibility that it is simply a bad card.'
      },
      {
        question: 'When during a draft are signals most valuable?',
        options: [
          'During pack 3 when you know your deck',
          'During picks 1-3 of pack 1',
          'During picks 4-8 of pack 1',
          'Signals have equal value at every point'
        ],
        correctIndex: 2,
        explanation: 'Picks 4-8 of pack 1 are the sweet spot for signal reading. Picks 1-3 are too early — strong cards get taken regardless of lane. By pick 4, the packs have been filtered enough to reveal preferences. By pack 2, you should already be committed to a lane, making signals less actionable.'
      }
    ],
    unlocks: ['color-signals', 'draft-as-experiment'],
    visual: {
      type: 'diagram',
      description: 'A pack of cards with arrows showing which cards were taken and which remain, with color-coded signal strength indicators for each color.'
    }
  },
  {
    id: 'streaming-json-parser',
    title: 'Streaming JSON Parser',
    type: 'lesson',
    summary: 'MTGA writes log data as a stream of mixed text and JSON. Parsing it requires a character-by-character state machine that tracks brace depth, string context, and escape sequences.',
    difficulty: 'intermediate',
    layers: {
      intuition: 'The MTGA log file mixes plain text debug messages with embedded JSON objects, and it reads like someone narrating a book while constantly interrupting themselves with asides and timestamps. You need to pick out just the complete sentences. That is what parsing the MTGA log feels like. The log file mixes plain text debug messages with embedded JSON objects, and those JSON objects can span multiple lines. You cannot just split on newlines or look for curly braces naively — you need to actually track whether you are inside a string, whether a brace is part of the JSON structure or part of a string value, and when a complete object has been emitted.',
      system: 'The streaming parser sits at the very front of the data pipeline. It watches the log file for new bytes (via file tailing), feeds them character by character into a state machine, and emits complete JSON objects as they are detected. Downstream consumers — the card identity resolver, the signal tracker, the overlay — never see raw log text. They receive clean, parsed objects. This separation is critical: it means the messy, format-dependent parsing logic is isolated in one place, and everything downstream can assume well-formed data.',
      technical: 'The parser maintains four pieces of state: depth (the current brace nesting level), inString (whether the current character is inside a JSON string), escape (whether the previous character was a backslash), and buffer (the accumulated characters of the current JSON object). When depth transitions from 0 to 1 on seeing an opening brace, the parser begins buffering. It increments depth on { and decrements on }, but only when not inside a string. When depth returns to 0, the buffer contains a complete JSON object, which is passed to JSON.parse() and emitted. String detection handles escaped quotes correctly: a quote preceded by a backslash does not toggle inString.',
      project: 'Implement a StreamingJsonParser class in TypeScript. The constructor should accept an EventEmitter or callback for emitting parsed objects. Expose a feed(chunk: string) method that processes a chunk of text character by character. Write unit tests with tricky cases: JSON containing string values with braces inside them, escaped quotes, nested objects, and objects split across multiple feed() calls. Test with a real MTGA log snippet to verify it correctly extracts DraftPick and DraftPack events while ignoring surrounding debug text.',
      theory: 'This parser is a pushdown automaton — a finite state machine augmented with a stack (the brace depth counter). Regular expressions cannot solve this problem because matching balanced braces requires counting, which is beyond the power of regular languages. The brace depth counter gives the parser exactly the memory it needs to recognize the context-free language of nested JSON objects. This is a practical encounter with the Chomsky hierarchy: the log format is not regular, so regular tools (grep, regex) are insufficient, but it is context-free, so a single counter suffices.'
    },
    prerequisites: ['state-machines', 'brace-counting'],
    relatedNodes: ['log-tailing', 'pipeline-architecture', 'event-emitter'],
    tags: ['parsing', 'json', 'state-machine', 'streaming', 'mtga'],
    personaFit: ['developer', 'curious-beginner'],
    quizItems: [
      {
        question: 'Why can\'t you use a regular expression to extract JSON objects from the MTGA log?',
        options: [
          'Regular expressions are too slow for real-time parsing',
          'Regular expressions cannot count balanced braces',
          'The log file is too large for regex to handle',
          'JSON is not a text-based format'
        ],
        correctIndex: 1,
        explanation: 'Matching balanced braces (knowing when an opening { has its corresponding closing }) requires counting, which is beyond the power of regular expressions. Regular languages — the class of languages that regex can recognize — cannot track arbitrary nesting depth. This is a fundamental result from formal language theory.'
      }
    ],
    unlocks: ['pipeline-architecture', 'card-identity'],
    visual: {
      type: 'pipeline',
      description: 'A flow diagram showing raw log bytes entering the state machine, with state indicators (depth counter, inString flag) shown at each step, and clean JSON objects emerging on the right.'
    }
  },
  {
    id: 'state-machines',
    title: 'State Machines as a Thinking Tool',
    type: 'concept',
    summary: 'A state machine is a way of breaking a complex process into a finite set of states and transitions. It turns implicit control flow into an explicit, testable model.',
    difficulty: 'beginner',
    layers: {
      intuition: 'State machines sound rigid and academic, but they are actually liberating. A traffic light can only be in one of three states: red, yellow, or green. It transitions between them in a fixed order, and the transition is triggered by a timer. You never wonder what state the traffic light is in — it is always exactly one of the three. A state machine takes this clarity and applies it to software. Instead of tangled if-else chains where you lose track of what mode the program is in, you define the states explicitly and the rules for moving between them. The program is always in exactly one state, and you can always ask which one.',
      system: 'In a data pipeline, state machines appear wherever you need to process a stream of input and track context. The JSON parser uses a state machine to know whether it is outside any JSON, inside an object, inside a string, or handling an escape character. The draft tracker uses a state machine to know whether the player is in the main menu, in a draft, making a pick, or building a deck. Each state determines which events are meaningful and which are ignored. The state machine pattern makes these distinctions explicit and centralized rather than scattered across conditional checks.',
      technical: 'A state machine in TypeScript can be as simple as an enum for states and a switch statement in a process() method. Define an enum State with values like IDLE, IN_OBJECT, IN_STRING, ESCAPED. The process method takes a character, checks the current state, and transitions accordingly. For the JSON parser: in IDLE, an opening brace transitions to IN_OBJECT and increments depth. In IN_OBJECT, a quote transitions to IN_STRING. In IN_STRING, a backslash transitions to ESCAPED, and a quote transitions back to IN_OBJECT. In ESCAPED, any character transitions back to IN_STRING. This explicit structure makes the parser easy to test — each state-input pair has a defined output.',
      project: 'Build a generic StateMachine<S, E> class where S is the state enum type and E is the event type. The constructor takes an initial state and a transition table: a Map from [state, event] pairs to [nextState, action] pairs. Expose a send(event: E) method that looks up the transition, updates the state, and calls the action. Then instantiate this class for the JSON parser and verify it handles the same test cases. This gives you a reusable tool for any future state machine need.',
      theory: 'State machines are one of the most fundamental models in computer science. A deterministic finite automaton (DFA) is the simplest — it has a fixed set of states, reads one input at a time, and transitions deterministically. DFAs recognize regular languages. By adding a stack (a pushdown automaton), you can recognize context-free languages like balanced parentheses and nested JSON. By adding a tape (a Turing machine), you get full computational power. The JSON parser is a pushdown automaton because it needs to count brace depth. Understanding this hierarchy helps you choose the right tool: if your problem is regular, a regex suffices; if it is context-free, you need a counter; if it is more complex, you may need a general-purpose algorithm.'
    },
    prerequisites: [],
    relatedNodes: ['streaming-json-parser', 'brace-counting', 'pipeline-architecture'],
    tags: ['state-machine', 'computer-science', 'patterns', 'fundamentals'],
    personaFit: ['curious-beginner', 'developer', 'educator'],
    quizItems: [
      {
        question: 'What is the key advantage of using an explicit state machine over nested if-else statements?',
        options: [
          'State machines are always faster to execute',
          'State machines use less memory',
          'The program is always in exactly one defined state, making behavior predictable and testable',
          'State machines can solve problems that if-else cannot'
        ],
        correctIndex: 2,
        explanation: 'The primary benefit is clarity: at any moment, the system is in exactly one known state, and every possible transition is explicitly defined. This makes the code easier to reason about, test, and debug. If-else chains can achieve the same behavior but make it harder to verify that all cases are handled and that the state is consistent.'
      }
    ],
    unlocks: ['streaming-json-parser', 'brace-counting'],
    visual: {
      type: 'diagram',
      description: 'A state transition diagram showing circles for each state (IDLE, IN_OBJECT, IN_STRING, ESCAPED) with labeled arrows for transitions triggered by characters like {, }, ", and backslash.'
    }
  },
  {
    id: 'card-identity',
    title: 'Card Identity Resolution',
    type: 'lesson',
    summary: 'MTGA refers to cards by numeric grpIds. Resolving these to human-readable names requires a local SQLite lookup with a Scryfall API fallback for unknown IDs.',
    difficulty: 'intermediate',
    layers: {
      intuition: 'MTGA never tells you a card\'s name — it only gives you a number called a grpId. You have a local SQLite database for fast lookups, but it was built last season, so some of the new cards are not listed. For those, you call the Scryfall API and look them up online. That is card identity resolution: the game client speaks in numeric IDs, you try the local database first for speed, and fall back to a remote API for anything unrecognized.',
      system: 'Card identity resolution is the second stage of the pipeline, sitting between the JSON parser and the display layer. When the parser emits a DraftPack event containing a list of grpIds, the identity resolver maps each one to a card object with a name, colors, mana cost, and rarity. The resolver tries the local SQLite database first for speed, then falls back to the Scryfall API for any grpId not found locally. Newly resolved cards are cached in SQLite so the API is only hit once per unknown card. This tiered lookup pattern keeps the overlay fast while handling new card sets gracefully.',
      technical: 'The SQLite database has a cards table with columns grp_id INTEGER PRIMARY KEY, name TEXT, colors TEXT, mana_cost TEXT, rarity TEXT, and set_code TEXT. The lookup function is async: it runs a SELECT query by grp_id, and if no row is returned, it hits the Scryfall API at api.scryfall.com/cards/arena/{grpId}. The Scryfall response includes the card name, colors, and other metadata. After a successful API call, the result is inserted into SQLite so subsequent lookups are instant. Error handling must account for rate limiting (Scryfall allows 10 requests per second) and invalid grpIds that return 404.',
      project: 'Create a CardResolver class with a resolve(grpId: number): Promise<Card> method. Initialize it with a path to the SQLite database file. Implement the two-tier lookup: query SQLite first, then call Scryfall. Add a batch method resolveAll(grpIds: number[]): Promise<Card[]> that runs the SQLite lookups in a single IN query, collects the misses, and fetches them from Scryfall with appropriate rate-limiting (use a simple delay between requests). Write tests using a test database with known cards and mock the Scryfall API to test the fallback path.',
      theory: 'This is an instance of the cache-aside pattern (also called lazy loading). The local database acts as a cache: the application checks it first and only goes to the authoritative source (Scryfall) on a miss, then populates the cache for future reads. The pattern trades write complexity (cache invalidation) for read speed. In this domain, cache invalidation is simple because card data is immutable — a grpId always maps to the same card. This immutability makes the cache-aside pattern especially effective and eliminates the usual challenges of cache staleness and consistency.'
    },
    prerequisites: ['streaming-json-parser', 'sql-thinking'],
    relatedNodes: ['gih-winrate', 'pipeline-architecture'],
    tags: ['identity', 'resolution', 'sqlite', 'scryfall', 'api', 'caching'],
    personaFit: ['developer', 'data-scientist'],
    quizItems: [
      {
        question: 'Why is SQLite preferred over a direct Scryfall API call for every card lookup?',
        options: [
          'SQLite has more card data than Scryfall',
          'Local database queries are much faster and avoid rate-limiting constraints',
          'Scryfall does not support grpId lookups',
          'SQLite is required by the MTGA client'
        ],
        correctIndex: 1,
        explanation: 'A SQLite query completes in microseconds, while an API call takes hundreds of milliseconds and is subject to Scryfall\'s rate limit of 10 requests per second. For real-time overlay display, the latency difference matters enormously. Using SQLite as a local cache gives near-instant lookups for known cards while still supporting new cards through the API fallback.'
      }
    ],
    unlocks: ['gih-winrate', 'seventeen-lands-data'],
    visual: {
      type: 'pipeline',
      description: 'A flow diagram showing grpId entering a decision diamond (found in SQLite?), with yes leading to instant result and no leading to Scryfall API call, then cache write, then result.'
    }
  },
  {
    id: 'gih-winrate',
    title: 'Understanding GIH Win Rate',
    type: 'concept',
    summary: 'GIH WR% (Games in Hand Win Rate) measures how often a player wins when a specific card is drawn. It is the most commonly cited metric — and also the most commonly misunderstood for evaluating card quality in limited.',
    difficulty: 'beginner',
    layers: {
      intuition: 'Why does a 58% win-rate card go late while a 53% card gets snapped up early? GIH WR% — Games in Hand Win Rate — tells you how often you win when a card shows up in your hand. A card with 60% GIH WR% means that in games where players drew this card, they won 60% of the time. The baseline is around 50% (since someone has to win and someone has to lose), so anything above 55% is genuinely good, and anything above 60% is exceptional. This metric cuts through hype and theory — it tells you what actually happens when people play the card.',
      system: '17Lands computes GIH WR% by tracking every game played by its users. For each card, it identifies every game where that card appeared in the player\'s hand at any point, then calculates the win rate across those games. The metric is powerful because it captures both the card\'s individual strength and the selection bias of drafting: good drafters tend to pick good cards, so high GIH WR% cards are being played by players who know what they are doing. This makes GIH WR% a blend of card quality and drafting skill, which is exactly what you want when deciding which card to pick.',
      technical: 'To use GIH WR% in your tool, you need to import the 17Lands card data for the current set. This data is available as a CSV or JSON download and includes columns for card name, color, rarity, GIH WR%, OH WR% (opening hand win rate), GD WR% (game drawn win rate), and ALSA (average last seen at). Store this data in your SQLite database alongside the card identity data. When displaying cards in the overlay, show the GIH WR% as a percentage badge. Color-code it: green for above 57%, yellow for 50-57%, red for below 50%. This gives the drafter an instant visual read on card quality.',
      project: 'Download the 17Lands card ratings for the current set and write a script to import them into your SQLite database. Add a card_stats table with columns name TEXT, gih_wr REAL, oh_wr REAL, gd_wr REAL, alsa REAL, and games_seen INTEGER. Join this table with your cards table on name to create a unified view. Then modify your overlay to show the GIH WR% next to each card in the draft pack. Add a sort-by-winrate toggle so the drafter can quickly see which cards in the pack are the strongest performers.',
      theory: 'GIH WR% is a conditional probability: P(win | card in hand). Its power comes from conditioning on a relevant event (the card being drawn), which filters out games where the card sat in the sideboard. However, the metric has important caveats. It conflates card quality with deck quality — a strong card that only appears in strong decks will have an inflated GIH WR%. This is Simpson\'s paradox in action: the aggregate statistic can be misleading if the underlying populations (strong decks vs weak decks) are not equally represented. OH WR% and GD WR% partially address this by separating games where the card was in the opening hand from games where it was drawn later, revealing whether a card is better early or late.'
    },
    prerequisites: [],
    relatedNodes: ['seventeen-lands-data', 'signals-as-data', 'color-signals', 'feature-engineering'],
    tags: ['metrics', 'winrate', '17lands', 'card-evaluation', 'statistics'],
    personaFit: ['mtg-player', 'data-scientist', 'curious-beginner'],
    quizItems: [
      {
        question: 'A card has a GIH WR% of 62%. What does this tell you?',
        options: [
          'The card is played in 62% of decks',
          'Players win 62% of games where this card appears in their hand',
          'The card is picked 62% of the time when it appears in a pack',
          '62% of players rate this card as good'
        ],
        correctIndex: 1,
        explanation: 'GIH WR% stands for Games in Hand Win Rate. A 62% GIH WR% means that across all tracked games where a player had this card in their hand at some point during the game, they won 62% of the time. This is an exceptionally strong metric, indicating the card significantly increases your chances of winning.'
      },
      {
        question: 'Why might GIH WR% overestimate a card\'s true strength?',
        options: [
          'The sample size is always too small',
          'It only counts games where the player mulliganed',
          'Strong cards tend to appear in strong decks built by skilled drafters, inflating the metric',
          'It does not account for the card\'s mana cost'
        ],
        correctIndex: 2,
        explanation: 'GIH WR% conflates card quality with deck quality and drafter skill. A powerful rare will be picked by experienced drafters who also build better decks overall, so the card\'s win rate includes the boost from being in a well-constructed deck piloted by a skilled player. This is a form of selection bias that inflates the metric beyond the card\'s isolated impact.'
      }
    ],
    unlocks: ['color-signals', 'feature-engineering'],
    visual: {
      type: 'card',
      description: 'A card display showing the card image with a color-coded GIH WR% badge in the corner — green for strong, yellow for average, red for weak.'
    }
  },
  {
    id: 'color-signals',
    title: 'Reading Color Signals',
    type: 'lesson',
    summary: 'Color signals tell you which colors are open at your seat based on the quality and quantity of cards being passed to you in each color.',
    difficulty: 'intermediate',
    layers: {
      intuition: 'Strong blue cards keep showing up in your packs while strong red cards vanish by pick 3 — what does that tell you? Each time a pack comes around, some cards have been taken and some remain. The cards that survive tell you what the other drafters do not want. If a color\'s best cards keep wheeling back to you, that color is "open" — nobody else at the table is competing for it. You do not need to see what other drafters are picking; you can read their preferences from what they leave behind.',
      system: 'The color signal system aggregates individual card signals into a per-color score. For each pack seen, the system notes which high-quality cards (GIH WR% above a threshold) are still present and which are missing. A color accumulates positive signal when its strong cards wheel or appear late, and negative signal when its strong cards disappear early. The signal is weighted by card quality — a 60% WR card wheeling is a stronger signal than a 53% WR card wheeling. The system normalizes scores across colors so the drafter can compare them directly.',
      technical: 'Implement color signals as a running average of signal strength per color. For each card seen in a pack, compute signal_strength = gih_wr - expected_wr_at_pick_position, where expected_wr_at_pick_position is a baseline derived from the average quality of cards taken at that position. Group these values by color and maintain a rolling average. Store the signals in a Map<Color, number> and update it after each pack event. Expose a getSignals(): Map<Color, number> method that returns the current signal state. Colors with positive values are open; negative values indicate the color is being cut.',
      project: 'Extend your overlay to include a signal bar for each color. After each pack is shown, update the bars in real time. Use a horizontal bar chart with five bars (one per color: white, blue, black, red, green), where the length represents signal strength. Positive signals extend to the right (color is open), negative signals extend to the left (color is contested). Add a tooltip showing the number of data points contributing to each signal. Test with a recorded draft log to verify the signals match manual analysis.',
      theory: 'Color signal reading is a form of Bayesian updating. The drafter starts with a prior belief about color openness (uniform — all colors equally likely to be open) and updates this belief as each pack provides new evidence. The strength of the update depends on the likelihood ratio: how surprising is it to see this card at this pick number? A premium common at pick 8 is very surprising (strong evidence the color is open), while a mediocre card at pick 8 is expected (weak evidence). The posterior probability of a color being open converges as more packs are observed, which is why experienced drafters say signals become clearer around pick 5-7.'
    },
    prerequisites: ['signals-as-data', 'gih-winrate'],
    relatedNodes: ['seventeen-lands-data', 'archetype-detection', 'draft-as-experiment'],
    tags: ['draft', 'signals', 'color', 'analysis', 'bayesian'],
    personaFit: ['mtg-player', 'data-scientist'],
    quizItems: [
      {
        question: 'You see a strong black removal spell (57% GIH WR%) still in the pack at pick 6, and a strong red creature (56% GIH WR%) still in the pack at pick 7. Which color is showing a stronger open signal?',
        options: [
          'Black, because the card has a higher GIH WR%',
          'Red, because a good card surviving to pick 7 is more unusual than pick 6',
          'They are equal signals',
          'Neither — you need at least 3 data points per color'
        ],
        correctIndex: 1,
        explanation: 'Signal strength depends not just on card quality but on how late the card was passed. A 56% WR card at pick 7 is more surprising (and therefore a stronger signal) than a 57% WR card at pick 6, because each additional pick that passes a good card adds evidence that the color is not being drafted by your neighbors. The pick number relative to card quality is what matters.'
      },
      {
        question: 'A premium red uncommon wheels (comes back to you after going around the table). What does this most likely indicate?',
        options: [
          'The card is worse than its GIH WR% suggests',
          'The other drafters made a mistake',
          'Red is likely open — few other drafters at the table are taking red cards',
          'The pack was unusually deep in all colors'
        ],
        correctIndex: 2,
        explanation: 'When a strong card wheels, it means every other drafter at the table passed it. The most parsimonious explanation is that those drafters are not prioritizing that color. A single wheel is not proof, but a premium card wheeling is strong evidence that the color is underdrafted at your seat — it is "open" for you to move into.'
      }
    ],
    unlocks: ['archetype-detection'],
    visual: {
      type: 'graph',
      description: 'A horizontal bar chart with five color-coded bars (W, U, B, R, G) showing signal strength from negative (contested) to positive (open), updated dynamically as packs are observed.'
    }
  },
  {
    id: 'pipeline-architecture',
    title: 'Pipeline Architecture: Extraction, Identity, Display',
    type: 'concept',
    summary: 'The draft overlay is built as a three-stage pipeline: extract raw data from the log, resolve card identities, and render the display. Each stage has a single responsibility.',
    difficulty: 'intermediate',
    layers: {
      intuition: 'Every complex system becomes simple when you split it into stages that each do one job. Raw materials come in one end, each station does one specific job, and finished products come out the other end. Nobody on the assembly line needs to understand the entire manufacturing process — they just need to do their step well and pass the result along. The draft overlay works the same way. Stage one reads the messy log file and extracts clean events. Stage two takes those events and figures out which cards are involved. Stage three takes the enriched card data and draws it on screen. Each stage is simple in isolation, even though the whole system is complex.',
      system: 'The pipeline pattern enforces separation of concerns through data flow. The extraction stage (log parser) depends only on the log format. The identity stage (card resolver) depends on the card database. The display stage (overlay renderer) depends on the UI framework. Changing the log format affects only stage one. Switching from SQLite to PostgreSQL affects only stage two. Redesigning the overlay affects only stage three. This independence is not just organizational tidiness — it is what makes the system testable. Each stage can be tested in isolation with mock inputs and verified outputs.',
      technical: 'In TypeScript, implement the pipeline as three classes connected by an EventEmitter. LogParser emits parsed-event with a typed payload. CardResolver listens for parsed-event, resolves the grpIds, and emits resolved-event with enriched data. OverlayRenderer listens for resolved-event and updates the DOM. The EventEmitter serves as the glue between stages without creating tight coupling. Each class has a single public API: LogParser.feed(chunk), CardResolver.resolve(event), OverlayRenderer.render(data). The pipeline is initialized by wiring up the event listeners in a bootstrap function.',
      project: 'Build the complete three-stage pipeline. Start with a bootstrap.ts file that creates instances of LogParser, CardResolver, and OverlayRenderer, then wires them together via an EventEmitter. Write an integration test that feeds a recorded log chunk into the pipeline and asserts that the overlay renderer receives the correct enriched card data. Measure the end-to-end latency from log event to screen update — it should be under 100ms for a responsive overlay experience.',
      theory: 'The pipeline architecture is an instance of the pipes and filters pattern from software architecture. Each filter (stage) is a pure transformation: it takes input, processes it, and produces output without side effects on other filters. The pipes (event emitters) decouple the filters temporally and structurally. This pattern enables composability (you can add, remove, or reorder stages), parallelism (stages can run concurrently if the pipe buffers), and testability (each stage is independently verifiable). The pattern dates back to Unix pipes and remains one of the most effective architectural patterns for data processing systems.'
    },
    prerequisites: ['streaming-json-parser', 'event-emitter'],
    relatedNodes: ['card-identity', 'deterministic-vs-llm', 'vertical-slices'],
    tags: ['architecture', 'pipeline', 'separation-of-concerns', 'design'],
    personaFit: ['developer', 'educator'],
    quizItems: [
      {
        question: 'What is the primary benefit of separating the log parser from the card resolver?',
        options: [
          'It makes the code run faster',
          'It allows each stage to be tested, changed, and understood independently',
          'It uses less memory',
          'It makes the code shorter'
        ],
        correctIndex: 1,
        explanation: 'Separation of concerns means each stage has a single responsibility with well-defined inputs and outputs. This makes testing straightforward (feed mock input, check output), modification safe (changing one stage does not break others), and comprehension easier (you can understand one stage without reading the others). Performance and code length are secondary to these architectural benefits.'
      },
      {
        question: 'Why should pipeline stages communicate through events rather than direct function calls?',
        options: [
          'Events are faster than function calls',
          'Direct calls create tight coupling — changing one stage forces changes in others',
          'Events use less memory than function calls',
          'Function calls cannot pass complex data types'
        ],
        correctIndex: 1,
        explanation: 'Direct function calls between stages create tight coupling: the caller must know the callee\'s exact interface, and any change to that interface ripples through every caller. Events decouple stages so that each stage only knows about the event format, not about the other stages. This means you can add, remove, or replace a stage without modifying the others.'
      }
    ],
    unlocks: ['vertical-slices', 'integration-order'],
    visual: {
      type: 'pipeline',
      description: 'Three boxes labeled Extraction, Identity, and Display connected by arrows. Each box shows its input type on the left edge and output type on the right edge, with the internal responsibility described inside.'
    }
  },
  {
    id: 'deterministic-vs-llm',
    title: 'Deterministic Systems vs Language Models',
    type: 'concept',
    summary: 'Some problems have exact answers and should be solved with deterministic code. Others require interpretation and judgment — that is where language models excel. Knowing the boundary is a core engineering skill.',
    difficulty: 'intermediate',
    layers: {
      intuition: 'Should an LLM parse your JSON? Absolutely not. You need two things done: calculate your taxes and write a cover letter. You would never want an AI to guess at your tax calculations — you want exact arithmetic that follows precise rules. But for the cover letter, you want creativity, tone-matching, and persuasion — things that are hard to reduce to rules. Software engineering has the same split. Parsing a log file is like taxes: there is one correct answer, and you want a program that gets it right every time. But interpreting what a draft pattern means and recommending a pick is like writing the cover letter: it requires weighing context, handling ambiguity, and making judgment calls.',
      system: 'In the draft overlay system, the boundary between deterministic and LLM-appropriate work falls along the pipeline stages. Extraction (log parsing) is entirely deterministic — the JSON either parses or it does not. Identity resolution (grpId to card name) is deterministic — the mapping is a lookup in a database. But interpretation — "based on these signals, what color should I draft?" or "explain why this card is good in this archetype" — is where an LLM adds value. The system design principle is: use deterministic code for everything that has a single correct answer, and reserve the LLM for tasks that benefit from reasoning over context.',
      technical: 'Architecturally, the deterministic stages produce structured data (typed TypeScript objects) that serve as context for LLM calls. When the user asks the overlay "what should I pick?", the system gathers the current pack contents, resolved card data, GIH WR% values, and color signals into a structured prompt. The LLM receives this verified data and produces a recommendation. The key insight is that the LLM never touches the raw log — it only sees pre-processed, validated data. This prevents hallucination about facts (card names, win rates) while leveraging the LLM\'s ability to synthesize and explain.',
      project: 'Add a recommendation endpoint to your overlay. When the user clicks "suggest pick," the system assembles a context object containing: the current pack (card names and GIH WR%), the drafter\'s current picks, the color signal scores, and the pick number. Format this as a prompt and send it to an LLM API. Display the LLM\'s recommendation alongside the deterministic data (GIH WR% rankings) so the user can see both the data-driven and reasoning-driven perspectives. Compare the LLM\'s suggestions against pure GIH WR% ranking to see when they diverge.',
      theory: 'This division maps onto the distinction between System 1 and System 2 thinking from cognitive science. Deterministic code is System 1: fast, automatic, always consistent. LLM reasoning is System 2: slower, deliberate, capable of handling novel situations. The optimal architecture uses System 1 for the fast path (data extraction, lookup, computation) and System 2 for the slow path (interpretation, explanation, recommendation). This hybrid approach gets the reliability of deterministic systems and the flexibility of language models, while avoiding the failure modes of each used alone.'
    },
    prerequisites: [],
    relatedNodes: ['pipeline-architecture', 'tool-calling', 'feature-engineering'],
    tags: ['llm', 'deterministic', 'architecture', 'hybrid-systems', 'ai-engineering'],
    personaFit: ['developer', 'data-scientist', 'educator'],
    quizItems: [
      {
        question: 'Which of these tasks should be handled by deterministic code rather than an LLM?',
        options: [
          'Explaining why a card is good in a specific archetype',
          'Parsing a grpId from a log line and looking up the card name',
          'Recommending which card to draft based on signals and deck needs',
          'Generating a summary of the draft so far'
        ],
        correctIndex: 1,
        explanation: 'Parsing a grpId and looking up a card name is a deterministic operation with exactly one correct answer. There is no ambiguity, no need for interpretation, and no benefit from the flexibility of a language model. Using deterministic code here guarantees correctness and speed. The other tasks involve synthesis, judgment, and natural language generation, which are strengths of LLMs.'
      }
    ],
    unlocks: ['tool-calling'],
    visual: {
      type: 'comparison',
      description: 'A two-column layout. Left column labeled "Deterministic" shows tasks like parsing, lookup, and computation with checkmarks. Right column labeled "LLM" shows tasks like interpretation, explanation, and recommendation with speech bubbles.'
    }
  },
  {
    id: 'event-emitter',
    title: 'Connecting Pipeline Stages with Events',
    type: 'lesson',
    summary: 'The EventEmitter pattern lets pipeline stages communicate without knowing about each other. Each stage emits events that downstream stages can listen for.',
    difficulty: 'intermediate',
    layers: {
      intuition: 'What if pipeline stages could communicate without ever knowing each other exist? The DJ speaks into the microphone without knowing who is listening. Some people have their radios tuned in, some do not. The DJ does not need to know the listeners, and the listeners do not need to know each other. They are connected by the broadcast, not by direct wires. EventEmitter works the same way: the log parser "broadcasts" that it found a new event, and any part of the system that cares can tune in. If nobody is listening, the event simply disappears. If three components are listening, they all get the message independently.',
      system: 'In the overlay pipeline, the EventEmitter is the communication backbone. It replaces direct function calls between stages with a publish-subscribe mechanism. The log parser publishes draft-pack events. The card resolver subscribes to those events and publishes resolved-pack events. The overlay renderer subscribes to resolved-pack events. The signal tracker also subscribes to resolved-pack events independently. This means adding a new consumer (like a draft logger or an analytics tracker) requires zero changes to existing code — you just subscribe to the relevant events.',
      technical: 'Node.js provides a built-in EventEmitter class, but for a typed TypeScript pipeline, you want type-safe events. Define an interface EventMap that maps event names to payload types: { "draft-pack": DraftPackEvent; "resolved-pack": ResolvedPackEvent; "signal-update": SignalUpdateEvent }. Create a TypedEventEmitter<T extends EventMap> class that wraps EventEmitter and provides typed emit() and on() methods. This way, emitting a draft-pack event with the wrong payload type is a compile-time error rather than a runtime bug.',
      project: 'Create a TypedEventEmitter class and use it to wire your pipeline. Define the complete event map for your system, including all event types and their payloads. Replace any direct function calls between pipeline stages with event emission. Verify that the pipeline still works end-to-end with the new decoupled communication. Then add a DraftLogger stage that subscribes to all events and writes them to a file for debugging and replay testing.',
      theory: 'The EventEmitter pattern is an implementation of the Observer design pattern, which itself is a specialization of the publish-subscribe architectural style. The key theoretical property is decoupling in three dimensions: spatial (emitter and listener do not need references to each other), temporal (events can be buffered or replayed), and logical (neither side encodes assumptions about the other\'s behavior). This triple decoupling is what makes the pattern so effective for evolving systems — new features can be added as new subscribers without modifying existing code, satisfying the Open-Closed Principle.'
    },
    prerequisites: [],
    relatedNodes: ['pipeline-architecture', 'streaming-json-parser'],
    tags: ['events', 'patterns', 'decoupling', 'observer', 'typescript'],
    personaFit: ['developer', 'curious-beginner'],
    quizItems: [
      {
        question: 'What happens if an EventEmitter emits an event and no listeners are registered for it?',
        options: [
          'The program throws an error',
          'The event is queued until a listener is added',
          'Nothing happens — the event is silently ignored',
          'The EventEmitter retries the event after a timeout'
        ],
        correctIndex: 2,
        explanation: 'When no listeners are registered for an event, the emission is simply a no-op. The event is not queued, retried, or cached. This is by design — it means components can emit events without worrying about whether anyone is consuming them, and listeners can be added or removed without affecting the emitter.'
      }
    ],
    unlocks: ['pipeline-architecture'],
    visual: {
      type: 'diagram',
      description: 'A central EventEmitter hub with arrows radiating outward to multiple listener boxes. Each arrow is labeled with an event type. The emitter box shows a "emit()" call, and each listener box shows an "on()" subscription.'
    }
  },
  {
    id: 'sql-thinking',
    title: 'SQL as a Way of Asking Questions',
    type: 'concept',
    summary: 'SQL is not just a database language — it is a way of thinking about data as tables and questions as queries. Learning to think in SQL makes you faster at data exploration.',
    difficulty: 'beginner',
    layers: {
      intuition: 'You have a massive spreadsheet with every Magic card ever printed: name, color, mana cost, power, toughness, set, rarity. You want to know which red commons in the current set have the highest win rate. In a spreadsheet, you might filter, sort, and scroll. In SQL, you write a single sentence: "Give me the name and win rate of all red common cards in the set, sorted by win rate descending." SQL is a language for asking precise questions about structured data. Once you learn to think in SQL, you stop scrolling through spreadsheets and start writing questions.',
      system: 'In the draft overlay system, SQLite serves as the local card database. Every card lookup, every stats query, and every batch resolution runs through SQL. The card_stats view joins the cards table with the 17Lands ratings table, creating a unified queryable surface. Draft logs can be stored in a drafts table and queried to answer questions like "what is my average win rate when I draft blue-black?" or "which cards do I pick that underperform their GIH WR%?" SQL turns the database from a static store into an interactive analytical tool.',
      technical: 'Key SQL patterns for the card database: SELECT name, gih_wr FROM cards JOIN card_stats USING (name) WHERE color LIKE "%R%" AND rarity = "common" ORDER BY gih_wr DESC retrieves the best red commons. Aggregate queries like SELECT color, AVG(gih_wr) FROM card_stats GROUP BY color show average win rates by color. Subqueries like SELECT * FROM cards WHERE gih_wr > (SELECT AVG(gih_wr) FROM card_stats) find above-average cards. Window functions like RANK() OVER (PARTITION BY color ORDER BY gih_wr DESC) rank cards within each color.',
      project: 'Build a query interface for your card database. Create a simple REPL or web interface where the user can type SQL queries and see results formatted as a table. Pre-populate it with useful example queries: top 10 cards by GIH WR%, best common in each color, average win rate by color pair, cards with the biggest gap between OH WR% and GD WR% (which reveals cards that are better drawn late). This tool becomes your data exploration workbench for any draft format.',
      theory: 'SQL is a declarative language — you specify what you want, not how to get it. The database engine (query optimizer) decides the execution plan: which index to use, which join algorithm to apply, which order to evaluate predicates. This separation of specification from execution is a powerful abstraction. It means the same query works efficiently whether the table has 100 rows or 100 million rows, because the optimizer adapts the plan to the data. Declarative programming is a fundamentally different paradigm from imperative programming, and understanding both makes you a more versatile problem-solver.'
    },
    prerequisites: [],
    relatedNodes: ['card-identity', 'seventeen-lands-data', 'feature-engineering'],
    tags: ['sql', 'databases', 'queries', 'data-exploration', 'sqlite'],
    personaFit: ['curious-beginner', 'data-scientist', 'developer'],
    unlocks: ['card-identity', 'feature-engineering'],
    visual: {
      type: 'diagram',
      description: 'A query input box at the top, with an arrow pointing to a table visualization below. The table shows card names, colors, and win rates, demonstrating how a SQL question produces a structured answer.'
    }
  },
  {
    id: 'typescript-schemas',
    title: 'TypeScript as a Schema Language',
    type: 'concept',
    summary: 'TypeScript types are more than IDE hints — they are executable documentation that describes the shape of your data and catches structural errors before runtime.',
    difficulty: 'beginner',
    layers: {
      intuition: 'A function accepts a DraftPackEvent, but someone passes it a PlayerInventoryEvent — what happens? Without types, it crashes at runtime. With TypeScript types, it never compiles in the first place. TypeScript types are like shipping labels for your data. When a function says it accepts a DraftPackEvent, you know exactly what fields that object has, what types they are, and what to expect — without reading the function body. If you try to send it a PlayerInventoryEvent instead, TypeScript catches the mistake before the code even runs. Types turn entire categories of bugs from runtime surprises into compile-time errors.',
      system: 'In the draft overlay, TypeScript types define the contract between pipeline stages. The LogParser emits objects of type DraftPackEvent (with fields like packNumber, pickNumber, and cardIds). The CardResolver accepts DraftPackEvent and produces ResolvedPackEvent (which adds cardNames, colors, and stats). The OverlayRenderer accepts ResolvedPackEvent. These types are the API documentation that stays in sync with the code because the compiler enforces it. If you add a field to DraftPackEvent, every consumer is immediately aware of it.',
      technical: 'Define types for every event in your pipeline: interface DraftPackEvent { type: "draft-pack"; packNumber: number; pickNumber: number; cardIds: number[]; }. Use discriminated unions for event routing: type PipelineEvent = DraftPackEvent | DraftPickEvent | GameStateEvent, with the type field as the discriminant. Use utility types like Pick<Card, "name" | "colors"> to create lightweight subtypes for specific uses. Use Partial<Card> for incomplete data during resolution. Use Record<Color, number> for the signal map. These patterns keep your types precise and meaningful.',
      project: 'Define the complete type system for your overlay in a types.ts file. Include types for all log events (DraftPack, DraftPick, GameState), all domain objects (Card, CardStats, Signal), all pipeline events, and all UI state. Use this type system to refactor your existing code, replacing any use of "any" or untyped objects with proper types. Run the TypeScript compiler in strict mode and fix all errors. Notice how many bugs the compiler finds — these are bugs that would have been runtime errors in JavaScript.',
      theory: 'TypeScript\'s type system is a form of lightweight formal verification. Each type annotation is a proposition about the data, and the type checker is a theorem prover that verifies these propositions at compile time. This connects to the Curry-Howard correspondence, which establishes a deep relationship between types and logical propositions: a type is a proposition, and a value of that type is a proof. When TypeScript confirms your code type-checks, it is proving that your data flows are structurally consistent. This is not as powerful as full formal verification, but it catches a large class of errors (null references, missing fields, type mismatches) with very low overhead.'
    },
    prerequisites: [],
    relatedNodes: ['pipeline-architecture', 'event-emitter'],
    tags: ['typescript', 'types', 'schemas', 'documentation', 'safety'],
    personaFit: ['developer', 'curious-beginner', 'educator'],
    quizItems: [
      {
        question: 'What is the primary advantage of defining TypeScript types for your pipeline events?',
        options: [
          'TypeScript types make the code run faster at runtime',
          'Types serve as executable documentation — the compiler enforces that data shapes match expectations, catching mismatches before runtime',
          'Types reduce the file size of the compiled JavaScript',
          'Types are required by Node.js to run TypeScript code'
        ],
        correctIndex: 1,
        explanation: 'TypeScript types act as contracts between pipeline stages. When you define that LogParser emits DraftPackEvent with specific fields, the compiler verifies that every consumer handles those exact fields. If you add or rename a field, every consumer that accesses it incorrectly becomes a compile-time error rather than a runtime bug. This is executable documentation — it stays in sync with the code because the compiler enforces it.'
      },
      {
        question: 'You define type PipelineEvent = DraftPackEvent | DraftPickEvent. What does the compiler guarantee about code that handles a PipelineEvent?',
        options: [
          'The code will automatically handle both event types correctly',
          'The code can only access fields shared by both event types unless it narrows the union with a type guard',
          'Both event types must have identical fields',
          'The code must handle events in the order they are listed in the union'
        ],
        correctIndex: 1,
        explanation: 'A discriminated union restricts access to only the fields that all members share, unless you narrow the type with a type guard (e.g., checking the type field). This forces you to explicitly handle each variant, preventing accidental access to fields that might not exist on a particular event type. The compiler makes "forgot to handle this case" a compile-time error.'
      }
    ],
    unlocks: ['pipeline-architecture', 'event-emitter'],
    visual: {
      type: 'diagram',
      description: 'A type definition on the left (showing interface fields) connected by arrows to a data object on the right (showing actual values), with green checkmarks on matching fields and a red X on a mismatched field.'
    }
  },
  {
    id: 'vertical-slices',
    title: 'Vertical Slices vs Horizontal Layers',
    type: 'concept',
    summary: 'Instead of building all the parsing, then all the logic, then all the UI, build one complete feature from log to screen. Vertical slices reduce risk and produce working software faster.',
    difficulty: 'intermediate',
    layers: {
      intuition: 'Most developers build in layers: all the parsing, then all the logic, then all the UI. The horizontal approach is: first lay every foundation, then frame every wall, then install every window. If you run out of time, you have a complete foundation but no livable rooms. The vertical approach is: build one complete room — foundation, walls, windows, plumbing, the works. If you run out of time, you have one room you can actually live in. Software works the same way. A vertical slice means building one feature from bottom (data) to top (UI) so you have something that works end to end. You can always add more slices later.',
      system: 'In the draft overlay project, a horizontal approach would be: first build the complete log parser (handling all event types), then build the complete card resolver (handling all edge cases), then build the complete UI (showing all data). A vertical approach is: first build just the DraftPack event parser, connect it to the card resolver for just those IDs, and display just the pack contents in the overlay. This single slice — seeing the current pack with card names — is already a useful tool. Then add the next slice: signal tracking. Then: deck tracking. Each slice delivers user value.',
      technical: 'Vertical slicing in TypeScript means your first commit touches every layer of the stack: the parser extracts one event type, the resolver handles the IDs in that event, and the renderer displays the result. Your interfaces should be designed to support incremental growth. Start with a minimal PipelineEvent union that has just DraftPackEvent. The renderer handles just that one event type. When you add DraftPickEvent in the next slice, you extend the union and add a new rendering case. Feature flags can gate incomplete slices so the main branch always works.',
      project: 'Plan your overlay as a series of vertical slices. Slice 1: parse DraftPack events, resolve card names, display pack contents. Slice 2: parse DraftPick events, track the player\'s picks, display the current pool. Slice 3: add GIH WR% data to the display. Slice 4: add color signal tracking. Slice 5: add archetype detection. Implement each slice as a complete pull request that touches parser, resolver, and renderer. After each slice, you have a working overlay with more features.',
      theory: 'Vertical slicing is rooted in the agile principle of delivering working software frequently. It aligns with the concept of a Minimum Viable Product (MVP) — the smallest thing that delivers value. From a risk management perspective, vertical slices front-load integration risk by forcing you to connect all layers early. Horizontal layers defer integration until the end, when bugs are hardest to fix. The mathematical analogy is: vertical slicing explores the breadth of the problem space early, then deepens selectively, while horizontal layering explores the depth first and hopes the layers compose.'
    },
    prerequisites: ['pipeline-architecture'],
    relatedNodes: ['integration-order', 'progressive-disclosure'],
    tags: ['architecture', 'agile', 'slicing', 'mvp', 'methodology'],
    personaFit: ['developer', 'educator'],
    quizItems: [
      {
        question: 'You have two weeks to build a draft overlay. With horizontal layering you finish the parser and resolver but run out of time before the UI. With vertical slicing you complete three feature slices. Which approach produces a more useful result?',
        options: [
          'Horizontal — at least the backend is complete and robust',
          'Vertical — you have three working features that a drafter can actually use, even if each is simple',
          'They are equivalent — the total code written is the same',
          'Horizontal — it is easier to add the UI later since the backend is done'
        ],
        correctIndex: 1,
        explanation: 'A complete parser and resolver with no UI delivers zero user value — the drafter cannot see any data. Three vertical slices, even if each is simple, give the drafter three working features they can use during drafts. Vertical slicing ensures that at any point you stop, you have a usable product. This is the core insight of delivering working software incrementally.'
      },
      {
        question: 'What risk does vertical slicing specifically mitigate that horizontal layering does not?',
        options: [
          'The risk of writing too much code',
          'The risk of using the wrong programming language',
          'Integration risk — the risk that separately built layers fail to work together',
          'The risk of running out of disk space'
        ],
        correctIndex: 2,
        explanation: 'Vertical slicing forces you to connect all layers (parsing, logic, UI) in the very first slice. Integration bugs surface immediately when they are cheap to fix. Horizontal layering defers integration to the end, when discovering that the layers do not compose well is expensive and demoralizing. Front-loading integration risk is the primary structural advantage of vertical slicing.'
      }
    ],
    unlocks: ['integration-order'],
    visual: {
      type: 'comparison',
      description: 'Two diagrams side by side. Left: horizontal layers stacked (Parser, Resolver, UI) with each fully built before the next. Right: vertical slices cutting through all three layers, each slice representing a complete feature from data to display.'
    }
  },
  {
    id: 'two-window-pattern',
    title: 'The Two-Window Pattern',
    type: 'lesson',
    summary: 'A transparent click-through overlay cannot receive mouse input. The two-window pattern solves this by using one window for display and another for interaction.',
    difficulty: 'advanced',
    layers: {
      intuition: 'A transparent window cannot receive mouse clicks — the OS sends them straight through to whatever is underneath. So how do you build an overlay that both displays data and accepts user input? You split it into two windows. One transparent window overlays the game for display, and a second opaque window handles controls and settings. The display window shows information, the control window handles interaction. They work as a coordinated pair.',
      system: 'The draft overlay needs to be transparent and click-through so the player can interact with the MTGA client underneath. But the overlay also needs interactive elements: a button to toggle data views, a text field for searching cards, and checkboxes for filtering. These two requirements conflict — a window cannot be both click-through and interactive simultaneously. The two-window pattern resolves this by creating a transparent, always-on-top, click-through window for the data display and a separate standard window for controls. The control window sends messages to the display window via IPC (inter-process communication) to update what is shown.',
      technical: 'In Electron, the display window is created with transparent: true, frame: false, and the platform-specific flag for click-through behavior (setIgnoreMouseEvents(true) on Windows and macOS). The control window is a standard BrowserWindow. Communication between them uses Electron\'s ipcMain and ipcRenderer modules. The control window sends messages like { type: "toggle-view", view: "signals" } to the main process, which forwards them to the display window. The display window updates its rendering accordingly. Both windows share the same pipeline data through a shared state module or through IPC messages carrying the full state.',
      project: 'Create the two-window Electron application. The display window should render your overlay data (pack contents, card stats, signals) on a transparent background. The control window should have a minimal UI: a dropdown to select the active view, a search box to filter cards, and a toggle to show/hide the overlay. Wire them together with IPC. Test the click-through behavior by verifying you can click on the MTGA client through the overlay. Test the control flow by verifying that toggling a view in the control window updates the display window.',
      theory: 'The two-window pattern is an instance of the Model-View separation principle taken to its extreme — the model and view are not just separate classes but separate OS-level windows. This physical separation enforces the architectural boundary with the strongest possible guarantee: the display window literally cannot handle input because the OS routes clicks through it. This is an example of making impossible states impossible — a principle from type-driven design applied at the systems level. The pattern also relates to the Command pattern in design, where the control window issues commands that are interpreted by the display window.'
    },
    prerequisites: ['pipeline-architecture'],
    relatedNodes: ['slot-aligned-overlay', 'progressive-disclosure'],
    tags: ['electron', 'overlay', 'ui', 'windows', 'click-through'],
    personaFit: ['developer'],
    quizItems: [
      {
        question: 'Why can\'t the overlay window be both click-through and interactive at the same time?',
        options: [
          'Electron does not support transparent windows',
          'The operating system routes mouse events to either the overlay or the application underneath — it cannot do both simultaneously for the same window region',
          'JavaScript cannot handle mouse events on transparent elements',
          'The game client blocks all overlay input regardless of window settings'
        ],
        correctIndex: 1,
        explanation: 'Click-through is an OS-level behavior: when enabled, the operating system sends mouse events through the window to whatever is behind it. The window never receives those events. You cannot selectively make parts of the same window click-through and other parts interactive at the OS level, which is why you need two separate windows — one for display (click-through) and one for controls (interactive).'
      },
      {
        question: 'The control window needs to change what the display window shows. What communication mechanism connects them in Electron?',
        options: [
          'Direct DOM manipulation — the control window modifies the display window\'s HTML',
          'A shared global variable that both windows read and write',
          'IPC (inter-process communication) — the control window sends messages through the main process to the display window',
          'WebSocket connection between the two windows'
        ],
        correctIndex: 2,
        explanation: 'In Electron, each BrowserWindow runs in its own renderer process and cannot directly access another window\'s DOM. Communication happens through IPC: the control window sends a message to the main process via ipcRenderer, and the main process forwards it to the display window. This decoupled communication preserves the architectural separation between the two windows.'
      }
    ],
    unlocks: ['slot-aligned-overlay'],
    visual: {
      type: 'diagram',
      description: 'Two overlapping rectangles: a large transparent one labeled "Display Window (click-through)" showing card data, and a small opaque one labeled "Control Window" with buttons and toggles. An IPC arrow connects them.'
    }
  },
  {
    id: 'seventeen-lands-data',
    title: '17Lands Data: What It Contains and How to Use It',
    type: 'lesson',
    summary: '17Lands is a community data project that tracks millions of draft games. Its dataset includes card performance metrics, color pair win rates, and archetype statistics.',
    difficulty: 'beginner',
    layers: {
      intuition: 'Over 10 million draft games have been recorded by the 17Lands community tracker — every pick, every match, every outcome. The result is a massive dataset that answers questions like "how good is this card really?" and "which color pairs win the most in this format?" It transforms drafting from folklore into evidence-based decision-making.',
      system: 'The 17Lands dataset includes several key tables. Card ratings provide per-card metrics: GIH WR%, OH WR%, GD WR%, IWD (improvement when drawn), ALSA (average last seen at), and ATA (average taken at). Color pair performance shows win rates for each two-color combination (WU, WB, WR, WG, UB, UR, UG, BR, BG, RG). The game data includes match results, turns played, cards drawn, and mulligans. Your overlay imports the card ratings to show real-time quality assessments. The color pair data informs archetype recommendations. The game data enables personal performance tracking.',
      technical: 'Download the 17Lands card evaluation data from the 17Lands website as a CSV. Parse it with a CSV library and insert it into your SQLite database. The key columns are Name, Color, Rarity, GIH WR, OH WR, GD WR, GNS WR (games not seen), IWD, ALSA, and ATA. Create indices on Name and Color for fast lookups. For color pair data, use the 17Lands color ratings page which shows aggregate win rates per archetype. Store these in a separate color_pairs table with columns pair TEXT, win_rate REAL, and games INTEGER. Write update scripts that can refresh this data when a new set releases.',
      project: 'Build a 17Lands data importer. Write a CLI script that downloads the latest card ratings CSV, parses it, and upserts the data into your SQLite database. Handle edge cases: cards with the same name in different sets, split cards, adventure cards, and modal double-faced cards. Add a --set flag to specify which set to import. Create a verification step that compares the row count in the database against the CSV to ensure no data was lost. Then build a simple dashboard that visualizes the imported data: a histogram of GIH WR% distribution, a table of the top 10 cards, and a bar chart of color pair win rates.',
      theory: 'The 17Lands dataset is an observational study, not a controlled experiment. This distinction matters because observational data is subject to confounding variables. A card might have a high GIH WR% not because it is intrinsically powerful, but because it is primarily picked by skilled drafters who also build better decks. This is the same challenge epidemiologists face when studying diet and disease from observational data. Techniques like stratification (comparing win rates at different skill levels) and regression (controlling for deck quality) can partially address this. The ALSA metric helps mitigate selection bias by revealing how highly the community values a card independently of its win rate.'
    },
    prerequisites: [],
    relatedNodes: ['gih-winrate', 'color-signals', 'draft-as-experiment', 'feature-engineering'],
    tags: ['17lands', 'data', 'metrics', 'community', 'analytics'],
    personaFit: ['mtg-player', 'data-scientist', 'curious-beginner'],
    quizItems: [
      {
        question: 'What does ALSA (Average Last Seen At) tell you about a card?',
        options: [
          'The average game turn when the card is first played',
          'The average pick number at which the card was last seen in a pack',
          'The average number of times the card is drawn per game',
          'The average deck position of the card'
        ],
        correctIndex: 1,
        explanation: 'ALSA measures how late a card survives in packs before being picked. A low ALSA (e.g., 2.0) means the card is taken early — it is highly valued. A high ALSA (e.g., 10.0) means the card frequently wheels — it is not prioritized. ALSA is useful because it reflects the community\'s valuation of the card independently of its actual performance.'
      }
    ],
    unlocks: ['gih-winrate', 'color-signals', 'archetype-detection'],
    visual: {
      type: 'graph',
      description: 'A scatter plot with ALSA on the x-axis and GIH WR% on the y-axis, showing each card as a dot. Cards in the upper-left (taken early, high win rate) are correctly valued; cards in the upper-right (taken late, high win rate) are undervalued gems.'
    }
  },
  {
    id: 'draft-as-experiment',
    title: 'Each Draft as a Natural Experiment',
    type: 'theory',
    summary: 'Every draft is a naturally occurring experiment with controlled variables (the card pool, the rules) and uncontrolled variables (the other players). Treating drafts as experiments enables systematic learning.',
    difficulty: 'intermediate',
    layers: {
      intuition: 'A scientist does not run one experiment and call it a day. They run many, varying conditions and observing outcomes, looking for patterns. Every draft you play is an experiment. The card pool is the experimental setup, your picks are the independent variable, and your match record is the outcome. By recording your experiments (logging your drafts) and analyzing the results (win rates by archetype, by color, by strategy), you can discover what works and what does not — not through theory alone, but through evidence. Drafting is not a game of luck; it is a game of learning from repeated trials.',
      system: 'The draft logging system records every experiment: which cards were available, which were picked, which colors were signaled as open, what archetype was built, and how the matches went. Over many drafts, this data enables retrospective analysis. Did you win more when you followed signals? Did forcing a specific archetype outperform staying open? Did first-picking the highest GIH WR% card lead to better outcomes than first-picking a card that fit your existing pool? These questions are answerable with enough data, and the overlay system generates that data automatically.',
      technical: 'Store draft logs in a structured format. Create a drafts table: id INTEGER, set TEXT, date TEXT, result TEXT (e.g., "7-2"), archetype TEXT. Create a picks table: draft_id INTEGER, pick_number INTEGER, card_name TEXT, pack_number INTEGER, cards_available TEXT (JSON array). Create a matches table: draft_id INTEGER, opponent_colors TEXT, result TEXT, turns INTEGER. After each draft, query your data: SELECT archetype, AVG(wins) as avg_wins, COUNT(*) as drafts FROM drafts GROUP BY archetype ORDER BY avg_wins DESC. This reveals which archetypes you succeed with and which you struggle with.',
      project: 'Build a draft journal that automatically records every draft you play. After each draft event ends (detected by a game-complete log event), compile the draft record from the accumulated pick and game data and insert it into the database. Create a simple analytics page: a table of recent drafts with results, a chart of win rate over time, and a breakdown of performance by archetype. Add a notes field so you can annotate each draft with qualitative observations ("I should have moved into green earlier"). This turns your drafting practice into a structured learning process.',
      theory: 'Each draft is a natural experiment in the causal inference sense. You observe an outcome (match record) after making a series of decisions (picks) in a partially controlled environment (the set\'s card pool, the draft mechanics) with confounding variables (the other drafters, the matchmaking). Drawing causal conclusions from observational data requires careful reasoning. Correlation (you often win when drafting blue) does not imply causation (blue might just be the best color in the format, regardless of your skill). To identify causal effects of your decisions, you need counterfactual reasoning: what would have happened if you had picked differently? The 17Lands dataset enables this by providing base rates against which your personal results can be compared.'
    },
    prerequisites: ['signals-as-data'],
    relatedNodes: ['seventeen-lands-data', 'feature-engineering', 'archetype-detection'],
    tags: ['methodology', 'experiment', 'learning', 'data-collection'],
    personaFit: ['data-scientist', 'mtg-player', 'educator'],
    unlocks: ['archetype-detection', 'feature-engineering'],
    visual: {
      type: 'graph',
      description: 'A timeline of drafts with each draft represented as a vertical bar chart showing wins and losses, color-coded by archetype. A trend line overlays the chart showing rolling win rate over time.'
    }
  },
  {
    id: 'archetype-detection',
    title: 'Inferring the Player\'s Archetype',
    type: 'lesson',
    summary: 'Given a player\'s picks so far, the system can infer which archetype they are building by analyzing color distribution, curve, and card role patterns.',
    difficulty: 'advanced',
    layers: {
      intuition: 'If someone is putting together a puzzle, you can often guess the picture before it is complete. Three blue pieces with water, a yellow piece with sand — it is probably a beach scene. Draft archetypes work the same way. If a player has picked three black removal spells, two blue card-draw spells, and a gold blue-black card, they are almost certainly drafting Dimir (blue-black) control. The archetype is the emerging pattern in their picks, and detecting it early helps the system provide relevant recommendations — suggesting cards that fit the archetype rather than generically strong cards.',
      system: 'The archetype detector runs after each pick, analyzing the player\'s accumulated card pool. It maintains a probability distribution over possible archetypes (the 10 two-color pairs plus mono-color and three-color variants). Each new pick updates the distribution: a gold blue-black card heavily increases the probability of Dimir, a green creature modestly increases Simic, Golgari, Selesnya, and Gruul. The system also considers curve (a low curve suggests aggro, a high curve suggests control), card roles (lots of removal suggests control, lots of combat tricks suggests aggro), and synergy themes (if the set has a specific mechanic tied to an archetype).',
      technical: 'Implement archetype detection as a scoring function over color pairs. For each of the 10 two-color pairs, compute a score based on: (1) the number of cards matching that color pair, weighted by the card\'s GIH WR% in that archetype, (2) the presence of gold cards in that pair (which are strong signals), and (3) the curve alignment with the archetype\'s typical curve. Normalize the scores to produce a probability distribution. The dominant archetype is the pair with the highest score. Use a threshold to distinguish "committed" (score > 0.6) from "open" (all scores < 0.4). Display the top two archetypes in the overlay with their probabilities.',
      project: 'Build the archetype detector and integrate it into the overlay. After each DraftPick event, update the archetype scores and display the top two candidates. Add a visual indicator showing how committed the drafter is to their current archetype — a progress bar that fills as the probability concentrates. When the archetype is committed, adjust the card recommendations in the pack to prioritize cards that fit the detected archetype over generically strong cards. Test with recorded draft logs from different archetype trajectories.',
      theory: 'Archetype detection is a classification problem. Given a set of features (the picks so far), assign a label (the archetype). In machine learning terms, you could train a classifier on labeled data (complete drafts where the archetype is known from the final deck). However, the rule-based approach works well here because the feature space is small and the decision boundaries are clear (color identity is a very strong predictor of archetype). This is a case where domain knowledge makes sophisticated ML unnecessary — a well-designed heuristic outperforms a generic classifier because you can encode the structural constraints of the domain (e.g., a deck cannot be both Dimir and Gruul) directly.'
    },
    prerequisites: ['color-signals', 'gih-winrate', 'seventeen-lands-data'],
    relatedNodes: ['feature-engineering', 'draft-as-experiment'],
    tags: ['archetype', 'classification', 'detection', 'draft', 'analysis'],
    personaFit: ['data-scientist', 'mtg-player', 'developer'],
    unlocks: ['feature-engineering'],
    visual: {
      type: 'graph',
      description: 'A radar chart (spider diagram) with one axis per two-color pair, showing the current archetype probability distribution. The dominant archetype has the longest spoke, and a color gradient fills the polygon.'
    }
  },
  {
    id: 'slot-aligned-overlay',
    title: 'Slot-Aligned Overlay Rendering',
    type: 'lesson',
    summary: 'Displaying data next to specific cards in the draft UI requires mapping card slot positions to pixel coordinates, accounting for screen resolution and MTGA\'s layout.',
    difficulty: 'advanced',
    layers: {
      intuition: 'Every card in the MTGA draft UI sits at a precise pixel position that shifts when the window resizes. You need to draw your win-rate badges right next to the correct card, and if the player changes their monitor resolution or window size, all the positions shift. Getting this alignment wrong by even a few pixels makes the overlay feel broken.',
      system: 'The slot alignment system maps logical card positions (slot 0 through slot 14 in a 15-card pack) to pixel coordinates on the screen. MTGA arranges draft cards in a grid that depends on the number of remaining cards. The system needs to know the MTGA window position and size, the card layout geometry (which changes depending on whether there are 15, 14, 13, or fewer cards), and the current screen resolution. The overlay window covers the entire screen, and the renderer draws data elements at the calculated positions.',
      technical: 'Define a SlotLayout type: { slotCount: number; positions: Array<{ x: number; y: number; width: number; height: number }> }. Create a layout calculator that takes the MTGA window bounds (obtained from the OS window API) and the current slot count, then computes positions. MTGA uses a responsive grid layout, so positions scale linearly with window size. The base positions (at a reference resolution like 1920x1080) are hardcoded from manual measurement, then scaled: actualX = baseX * (windowWidth / 1920). Use requestAnimationFrame to re-render when positions change. Add a calibration mode that overlays colored rectangles so the user can verify alignment.',
      project: 'Implement the slot alignment system. Create the position calculator with a set of base coordinates measured from MTGA at 1920x1080. Add scaling logic for different resolutions. Build a calibration overlay that draws translucent colored rectangles at each card slot so the user can visually verify the alignment. Store the user\'s calibration offset (if they need to nudge positions) in a config file. Then connect this to the real overlay: render GIH WR% badges at each card\'s position. Test at multiple resolutions and window sizes.',
      theory: 'Slot alignment is a coordinate mapping problem — a simplified form of the registration problem in computer vision. You are aligning two coordinate systems: the overlay\'s pixel grid and MTGA\'s card layout. In the general case, this requires an affine transformation (translation, scaling, rotation). Since the overlay and MTGA share the same screen orientation, rotation is zero, simplifying the transform to translation and scaling. The calibration step is a manual instance of what computer vision does automatically with feature matching. A more sophisticated approach would use screen capture and template matching to detect card positions automatically, but the manual approach is more reliable and simpler to implement.'
    },
    prerequisites: ['two-window-pattern'],
    relatedNodes: ['progressive-disclosure', 'pipeline-architecture'],
    tags: ['overlay', 'rendering', 'coordinates', 'ui', 'alignment'],
    personaFit: ['developer'],
    unlocks: ['progressive-disclosure'],
    visual: {
      type: 'diagram',
      description: 'A mock MTGA draft screen with a grid of card slots. Colored badges are drawn at each slot position, and dotted lines connect each badge to a coordinate label showing the pixel position.'
    }
  },
  {
    id: 'log-tailing',
    title: 'Watching a File for Changes',
    type: 'lesson',
    summary: 'Log tailing reads new data from a file as it is written by another process. It is the input mechanism that connects the MTGA client to the overlay pipeline.',
    difficulty: 'intermediate',
    layers: {
      intuition: 'The MTGA client writes to its log file continuously as events happen — packs opened, cards picked, games started. Your program does not go looking for data — it just watches the end of that file and processes whatever arrives. When new data appears, you read it and feed it into your pipeline. You never read the whole file from scratch — you just pick up where you left off.',
      system: 'The file tailer is the very first component in the pipeline — it sits upstream of even the JSON parser. It uses the operating system\'s file-watching API (fs.watch on Node.js, or a polling-based fallback) to detect when the MTGA log file changes. When new bytes are written, it reads from its last known position to the end of the file, then advances the position marker. The chunk of new text is passed to the streaming JSON parser for processing. On MTGA startup, the tailer also handles the case where the log file is truncated (the game client creates a fresh log), resetting the position to zero.',
      technical: 'Use Node.js fs.watch or a library like chokidar to watch the MTGA log file (typically at %APPDATA%/../LocalLow/Wizards Of The Coast/MTGA/Player.log on Windows). Maintain a readPosition variable initialized to the file\'s size at startup (to skip historical data). When a change event fires, open the file, seek to readPosition, read to the end, update readPosition, and emit the chunk. Handle edge cases: the file might be locked by MTGA (use fs.open with the read-share flag), the file might be rotated (detect by checking if the current size is smaller than readPosition), and the file watcher might fire multiple events for a single write (debounce with a short timeout).',
      project: 'Implement a LogTailer class with start(filePath: string) and stop() methods. The start method initializes the file watcher and read position. Expose an on("data", callback) event for downstream consumers. Write tests that create a temporary file, write data to it in chunks, and verify that the tailer emits the correct chunks in order. Test the truncation case by writing data, then truncating the file to zero and writing new data. Test the locking case by having two processes read the file simultaneously.',
      theory: 'Log tailing is an instance of the producer-consumer pattern with a file as the communication channel. The MTGA client is the producer, the tailer is the consumer, and the file is a persistent buffer. This pattern predates modern message queues — Unix tail -f has been used for log monitoring since the 1970s. The key theoretical property is eventual consistency: the tailer is guaranteed to eventually see all data written by the producer, but there is an unbounded (though typically small) delay. This is sufficient for the overlay because sub-second latency is acceptable for displaying draft data.'
    },
    prerequisites: [],
    relatedNodes: ['streaming-json-parser', 'pipeline-architecture', 'event-emitter'],
    tags: ['file-watching', 'streaming', 'input', 'real-time', 'os'],
    personaFit: ['developer', 'curious-beginner'],
    quizItems: [
      {
        question: 'What is the key difference between file watching (fs.watch) and polling for changes?',
        options: [
          'Polling is always more reliable than file watching',
          'File watching uses OS-level notifications and reacts immediately; polling checks at fixed intervals and may miss rapid changes or waste CPU',
          'File watching works only on Linux; polling is cross-platform',
          'There is no practical difference — both are equivalent'
        ],
        correctIndex: 1,
        explanation: 'File watching leverages OS-level file system notifications (inotify on Linux, FSEvents on macOS, ReadDirectoryChangesW on Windows) to be notified immediately when a file changes. Polling repeatedly checks the file at intervals, which introduces latency and wastes CPU cycles when nothing has changed. However, polling can be a useful fallback when OS-level watching is unreliable.'
      },
      {
        question: 'The log tailer detects that the file\'s current size is smaller than its stored readPosition. What most likely happened?',
        options: [
          'The file has been corrupted and should be ignored',
          'Another process deleted some lines from the middle of the file',
          'The application (MTGA) truncated and recreated the log file on restart',
          'The operating system compacted the file to save disk space'
        ],
        correctIndex: 2,
        explanation: 'When a file\'s size drops below the tailer\'s read position, the most common cause is truncation — the application started a new session and overwrote the log file from the beginning. The correct response is to reset the read position to zero and start reading the new content from the start of the file.'
      }
    ],
    unlocks: ['streaming-json-parser'],
    visual: {
      type: 'pipeline',
      description: 'A file icon on the left with new lines appearing at the bottom. An arrow shows the read cursor advancing as new lines are emitted to the right, feeding into the parser.'
    }
  },
  {
    id: 'progressive-disclosure',
    title: 'Progressive Disclosure in UI Design',
    type: 'concept',
    summary: 'Show the most important information first and reveal details on demand. This keeps the overlay useful without overwhelming the player during a timed draft.',
    difficulty: 'beginner',
    layers: {
      intuition: 'A good waiter at a restaurant does not recite the entire menu when you sit down. They might mention today\'s specials, then hand you the menu to browse at your own pace, and answer detailed questions about ingredients if you ask. Progressive disclosure in UI design follows the same principle: show the essential information upfront (card names and GIH WR%), make the next level available with a simple action (hover for detailed stats), and keep the deepest details accessible but hidden (click for full analysis). Each level of detail is revealed only when the user signals they want it.',
      system: 'The overlay has three disclosure levels. Level 1 (always visible): card names and color-coded GIH WR% badges on each card in the pack. This is the bare minimum a drafter needs. Level 2 (on hover): expanded stats panel showing OH WR%, GD WR%, ALSA, and the card\'s 17Lands grade. Level 3 (on click or keyboard shortcut): full analysis including color signal summary, archetype fit, and synergy notes. The control window has a toggle to set the maximum disclosure level, so users who want a minimal overlay can cap it at level 1.',
      technical: 'Implement disclosure levels with CSS classes and data attributes. Each overlay element has a data-disclosure attribute of 1, 2, or 3. A global CSS variable --max-disclosure controls visibility: elements with data-disclosure greater than --max-disclosure get display: none. Hover interactions on level-1 elements add a temporary class that reveals level-2 content within that element\'s subtree. The control window sends IPC messages to update --max-disclosure. This approach keeps the rendering logic simple and the disclosure behavior entirely in CSS, making it easy to adjust layouts for each level.',
      project: 'Redesign your overlay with three disclosure levels. At level 1, show only card names and color-coded win-rate badges. At level 2 (hover), show a tooltip-style panel with detailed stats. At level 3 (keyboard shortcut), show the full analysis panel. Implement the CSS-based disclosure system and wire the control window toggle. User-test with a draft: is the level-1 view clean enough to not distract? Is the level-2 hover responsive enough for a timed pick? Does level-3 provide genuinely useful additional information?',
      theory: 'Progressive disclosure is grounded in George Miller\'s cognitive load theory — humans can process about 7 plus or minus 2 chunks of information at once. An overlay showing 15 cards with 8 stats each presents 120 data points, far exceeding cognitive capacity. By showing only the most actionable data (GIH WR%) at the default level, you reduce the cognitive load to 15 data points, which is manageable during a timed draft pick. The layered approach also respects the expertise gradient: beginners need only the top-level summary, while experts want access to the details. This maps onto the concept of scaffolding in educational psychology.'
    },
    prerequisites: [],
    relatedNodes: ['two-window-pattern', 'slot-aligned-overlay', 'narrative-design'],
    tags: ['ui', 'design', 'disclosure', 'cognitive-load', 'ux'],
    personaFit: ['curious-beginner', 'developer', 'educator'],
    quizItems: [
      {
        question: 'An overlay displays 15 cards with 8 statistics each. Why is this problematic during a timed draft pick?',
        options: [
          'The rendering engine cannot handle that many elements',
          'It exceeds human cognitive capacity — people can process roughly 7 chunks of information at once',
          'The statistics are too small to read on screen',
          'Draft picks are not timed, so it is not a problem'
        ],
        correctIndex: 1,
        explanation: 'George Miller\'s cognitive load research shows humans can process about 7 plus or minus 2 chunks of information simultaneously. An overlay presenting 120 data points (15 cards times 8 stats) overwhelms the drafter, especially under time pressure. Progressive disclosure solves this by showing only the most actionable data at the default level and revealing details on demand.'
      },
      {
        question: 'In a three-layer disclosure system, what determines which layer a piece of information belongs to?',
        options: [
          'The data type — numbers go to layer 1, text to layer 2, charts to layer 3',
          'The screen position — top of screen is layer 1, bottom is layer 3',
          'How actionable and frequently needed the information is during the core task',
          'The order in which the data was computed by the pipeline'
        ],
        correctIndex: 2,
        explanation: 'Layer assignment is driven by how critical and frequently needed the information is. Layer 1 holds what the user needs for every decision (e.g., card name and GIH WR%). Layer 2 holds supporting details useful for closer analysis. Layer 3 holds deep-dive information only needed occasionally. The goal is to match each layer to a level of user intent.'
      }
    ],
    unlocks: ['narrative-design'],
    visual: {
      type: 'diagram',
      description: 'Three side-by-side views of the same overlay. View 1 (minimal): just card names and badges. View 2 (hover): an expanded tooltip appears on one card. View 3 (full): a detailed panel fills a portion of the screen.'
    }
  },
  {
    id: 'quiz-driven-learning',
    title: 'Quiz-Driven Learning',
    type: 'concept',
    summary: 'Quizzes are not just assessments — they are learning tools. The act of retrieving knowledge strengthens memory more than re-reading. This is the testing effect.',
    difficulty: 'beginner',
    layers: {
      intuition: 'Reading about GIH WR% feels like understanding, but can you actually use it? The real learning happens not when you read, but when you wobble. Quizzes force that wobble. When a quiz asks "a card has 54% GIH WR% and 48% OH WR% — is it better early or late?" you have to actually think. That moment of mental effort — retrieving the concept and applying it — is where learning solidifies. A wrong answer followed by an explanation teaches more than a correct answer without reflection.',
      system: 'The quiz system is integrated into the content graph. Each content node can have associated quiz items that test comprehension of that node\'s key ideas. Quizzes are triggered after the learner reads a node, with spaced repetition for nodes that were answered incorrectly. The system tracks which questions were answered correctly on the first try, which required multiple attempts, and which were consistently missed. This data feeds back into the pathway system to identify gaps in understanding and suggest review nodes.',
      technical: 'Quiz items are stored as part of the ContentNode data. Each QuizItem has a question string, an array of option strings, a correctIndex number, and an explanation string. The quiz renderer presents the question and options, records the user\'s selection, reveals the correct answer with the explanation, and stores the result. For spaced repetition, track each quiz item\'s history: { quizId: string, attempts: number, lastCorrect: boolean, nextReviewDate: Date }. Use a simple spaced repetition algorithm: if correct, double the review interval; if incorrect, reset to 1 day.',
      project: 'Build the quiz component. It should accept a ContentNode, extract its quizItems, and present them one at a time. After the user selects an answer, highlight the correct option in green (and the selected wrong option in red if applicable), and show the explanation. Track results in localStorage or a database. Add a "quiz me" button to each content node view. Create a review mode that surfaces quiz items due for spaced repetition review. Display a summary of quiz performance: total questions attempted, accuracy rate, and most-missed topics.',
      theory: 'The testing effect, demonstrated by Roediger and Karpicke (2006), shows that retrieval practice (testing) produces better long-term retention than repeated study. This is because retrieval strengthens the neural pathways associated with the memory, a process called retrieval-induced facilitation. Spaced repetition leverages the spacing effect, which shows that distributed practice is more effective than massed practice. Together, these two effects — testing and spacing — form the empirical foundation for quiz-driven learning. The quiz system combines both: it tests knowledge (retrieval practice) at increasing intervals (spaced repetition), optimizing for long-term retention.'
    },
    prerequisites: [],
    relatedNodes: ['narrative-design', 'progressive-disclosure'],
    tags: ['learning', 'quizzes', 'testing-effect', 'spaced-repetition', 'pedagogy'],
    personaFit: ['educator', 'curious-beginner'],
    quizItems: [
      {
        question: 'A student reads a chapter on Bayesian statistics twice, while another student reads it once and then takes a quiz. Who will remember more a week later?',
        options: [
          'The student who read twice — more exposure means better memory',
          'The student who took the quiz — retrieval practice strengthens memory more than re-reading',
          'They will remember the same amount',
          'It depends on the difficulty of the material'
        ],
        correctIndex: 1,
        explanation: 'The testing effect, demonstrated by Roediger and Karpicke, shows that retrieval practice (being tested) produces significantly better long-term retention than repeated study. The act of retrieving information strengthens the memory trace in a way that passive re-reading does not. This is why quizzes are learning tools, not just assessment tools.'
      },
      {
        question: 'Why does a wrong answer followed by an explanation often teach more than getting the right answer immediately?',
        options: [
          'Wrong answers are penalized, which creates fear-based motivation',
          'The surprise of being wrong creates a prediction error that makes the correction more memorable',
          'Wrong answers take longer to process, and time spent equals learning',
          'It does not — getting the right answer is always better for learning'
        ],
        correctIndex: 1,
        explanation: 'When you confidently select a wrong answer, your brain experiences a prediction error — the mismatch between expectation and reality. This error signal triggers deeper processing of the corrective feedback, making the correct information more memorable than if you had simply gotten it right without effortful engagement. This is why well-designed quizzes include detailed explanations for every answer.'
      }
    ],
    unlocks: ['narrative-design'],
    visual: {
      type: 'card',
      description: 'A quiz card showing a question at the top, four answer options in the middle (one highlighted green for correct), and an explanation panel at the bottom that slides into view after answering.'
    }
  },
  {
    id: 'narrative-design',
    title: 'Why the Order of Ideas Matters',
    type: 'concept',
    summary: 'Learning is not a random walk through concepts. The sequence in which ideas are introduced determines whether the learner builds understanding or accumulates confusion.',
    difficulty: 'beginner',
    layers: {
      intuition: 'A mystery novel does not start by revealing the killer. It introduces the detective, the crime scene, the suspects, and the clues in an order designed to build tension and understanding. By the time the reveal happens, you have enough context to appreciate it. Teaching works the same way. If someone starts explaining the JSON parser before you know what a log file is, or explains archetype detection before you know what colors are, the information does not stick. Narrative design means choosing the order of concepts so that each new idea has a foundation of prior ideas to land on.',
      system: 'The content graph encodes narrative dependencies through the prerequisites field. Each node lists the nodes that should be understood first. The pathway system uses these prerequisites to generate a valid learning sequence — a topological sort of the dependency graph, adjusted for the learner\'s persona and current knowledge. Multiple valid orderings exist for any given set of prerequisites; the pathway chooses among them based on narrative flow: concepts before tools, intuition before formalism, concrete before abstract.',
      technical: 'Implement pathway generation as a modified topological sort on the content graph. Build the prerequisite graph: for each node, add edges from its prerequisites to itself. Perform a topological sort to get a valid ordering. When multiple nodes have the same topological level (no ordering constraint between them), break ties using a narrative priority heuristic: concept nodes before lesson nodes, beginner difficulty before intermediate, and nodes with more downstream dependents first (they enable more future learning). Validate that the generated pathway has no cycles and that every prerequisite is satisfied before its dependent node appears.',
      project: 'Create a pathway generator that takes a target set of nodes and produces an ordered learning path. Input: a list of node IDs the learner wants to master. Output: a sequence that includes all prerequisites and the target nodes, ordered by narrative flow. Test with the five personas: the MTG player path should lead with draft concepts before diving into engineering; the developer path should lead with architecture before draft theory. Validate each generated path by checking that every node\'s prerequisites appear earlier in the sequence.',
      theory: 'Narrative design in education draws on schema theory from cognitive psychology. A schema is a mental framework that organizes knowledge and facilitates understanding of new information. New concepts are learned by assimilating them into existing schemas. If the schema does not exist yet, the concept floats without anchorage and is quickly forgotten. Prerequisite ordering ensures that the required schemas are built before the concepts that depend on them are introduced. This is also related to Vygotsky\'s Zone of Proximal Development: each new node should be just beyond the learner\'s current understanding, reachable with the support of the preceding nodes.'
    },
    prerequisites: [],
    relatedNodes: ['progressive-disclosure', 'quiz-driven-learning'],
    tags: ['narrative', 'pedagogy', 'ordering', 'prerequisites', 'learning-design'],
    personaFit: ['educator', 'curious-beginner'],
    quizItems: [
      {
        question: 'A learning path introduces archetype detection before explaining what draft colors are. What is the most likely outcome?',
        options: [
          'The learner will understand archetypes faster because it is a more advanced topic',
          'The learner will lack the prerequisite schema and fail to anchor the new concept',
          'The order does not matter as long as both topics are covered eventually',
          'The learner will skip the archetype section and come back to it later'
        ],
        correctIndex: 1,
        explanation: 'Schema theory predicts that new concepts must attach to existing mental frameworks. Without understanding colors, the learner has no schema for "color pair," which is foundational to archetypes. The concept floats without anchorage and is quickly forgotten. Prerequisite ordering prevents this by ensuring foundational schemas are built first.'
      },
      {
        question: 'Why does a topological sort of the prerequisite graph produce a valid learning sequence?',
        options: [
          'It alphabetizes the nodes for easy lookup',
          'It groups nodes by difficulty level',
          'It guarantees every node appears after all of its prerequisites in the sequence',
          'It minimizes the total number of nodes the learner must visit'
        ],
        correctIndex: 2,
        explanation: 'A topological sort of a directed acyclic graph produces an ordering where every node comes after all nodes it depends on. Applied to the content graph, this means every concept appears in the sequence only after all of its prerequisites have been introduced, ensuring the learner always has the necessary foundation for each new idea.'
      }
    ],
    unlocks: ['progressive-disclosure', 'quiz-driven-learning'],
    visual: {
      type: 'graph',
      description: 'A directed acyclic graph (DAG) of content nodes, with arrows showing prerequisite relationships. The nodes are arranged in topological order from left to right, with color-coding by difficulty level.'
    }
  },
  {
    id: 'feature-engineering',
    title: 'Turning Raw Data into Useful Features',
    type: 'lesson',
    summary: 'Raw data (card IDs, pick numbers, game results) becomes useful only when transformed into features that capture meaningful patterns — like signal strength, curve gaps, or archetype fit.',
    difficulty: 'intermediate',
    layers: {
      intuition: 'Raw ingredients are not a meal. Flour, eggs, sugar, and butter are just stuff until someone turns them into a cake. Feature engineering is the cooking step for data. A list of card IDs is just stuff — but computing the color distribution, the mana curve shape, the removal count, and the average GIH WR% of the picks transforms that list into a meaningful portrait of a draft. Every interesting question about drafting ("Am I in the right lane?", "Is my curve too high?", "Do I have enough removal?") is answered not by raw data but by features derived from it.',
      system: 'The feature engineering layer sits between the raw data store and the analytical or display layer. It takes the player\'s pick history and computes derived features: color_distribution (a 5-element vector of pick counts per color), curve (a histogram of mana values), removal_count (cards tagged as removal in the card database), creature_count, average_gih_wr (mean GIH WR% of all picks), signal_alignment (how well the picks match the detected color signals), and archetype_confidence (the probability assigned to the most likely archetype). These features are recomputed after each pick and stored as the current draft state.',
      technical: 'Implement features as a DraftState interface: { colorDistribution: Record<Color, number>; curve: number[]; creatureCount: number; removalCount: number; avgGihWr: number; signalAlignment: number; archetypeConfidence: number; topArchetype: string }. Create a computeFeatures(picks: Card[]): DraftState function that derives all features from the pick list. For curve, index by mana value: curve[card.mv] += 1. For signal alignment, compute the dot product of color distribution with the signal strength vector. For archetype confidence, use the archetype detector\'s output. Normalize all features to a 0-1 range for display consistency.',
      project: 'Build the feature computation module and add a feature dashboard to your overlay. After each pick, recompute all features and display them as a compact status bar: a mini mana curve chart, color distribution pips, creature/removal ratio, and an archetype indicator. Use the features to trigger recommendations: if removal_count is less than 2 by pick 15, highlight removal spells in the pack. If curve has a gap at 2-mana, highlight 2-drops. These feature-driven nudges help the drafter address deck-building weaknesses in real time.',
      theory: 'Feature engineering is the process of creating informative representations from raw data. In machine learning, the quality of features often matters more than the choice of model — a simple classifier with good features outperforms a complex model with poor features. This is known as the feature engineering hypothesis. In the draft context, raw card IDs are a low-information representation (each ID is just an arbitrary number), but the derived features (color distribution, curve shape, removal density) capture the structural properties that determine deck quality. This transformation from raw data to meaningful features is the core intellectual act of applied data science.'
    },
    prerequisites: ['gih-winrate', 'seventeen-lands-data'],
    relatedNodes: ['archetype-detection', 'draft-as-experiment', 'sql-thinking'],
    tags: ['features', 'data-science', 'transformation', 'engineering', 'analytics'],
    personaFit: ['data-scientist', 'developer'],
    quizItems: [
      {
        question: 'You have a list of 15 picked cards with their grpIds. Which of these is a raw datum, and which is a derived feature?',
        options: [
          'The grpId of the third pick is raw; the number of blue cards picked is derived',
          'Both are raw data',
          'Both are derived features',
          'The number of blue cards is raw; the grpId is derived'
        ],
        correctIndex: 0,
        explanation: 'A grpId is raw data — it comes directly from the log without any transformation. The number of blue cards picked is a derived feature — it requires looking up each grpId\'s color identity and counting those that include blue. Feature engineering is the process of transforming raw data into these more meaningful representations.'
      }
    ],
    unlocks: ['archetype-detection'],
    visual: {
      type: 'pipeline',
      description: 'A funnel diagram showing raw data (card IDs, pick numbers) on the left, the feature computation process in the middle (with formulas for each feature), and the derived features (curve chart, color pips, removal count) on the right.'
    }
  },
  {
    id: 'tool-calling',
    title: 'LLMs Invoking Deterministic Tools',
    type: 'concept',
    summary: 'Instead of asking an LLM to calculate or look up data (which it may hallucinate), give it access to deterministic tools. The LLM decides what to ask; the tool provides the reliable answer.',
    difficulty: 'intermediate',
    layers: {
      intuition: 'An LLM asked for a card\'s win rate might confidently say 57.3% when the real number is 52.1% — it has no way to know. You would not ask a strategist to add up quarterly figures — you would hand them a calculator and let them decide which numbers to plug in. Tool calling works the same way with LLMs. The LLM is great at understanding questions and formulating plans, but unreliable at precise computation, data lookup, and factual recall. By giving it tools — a database query function, a card lookup function, a signal calculator — the LLM can decide what information it needs and invoke the right tool to get a precise answer. The LLM thinks; the tools compute.',
      system: 'In the draft overlay, tool calling enables the recommendation engine. When the user asks "what should I pick?", the LLM receives the question along with a set of available tools: query_card_stats(name) returns a card\'s GIH WR% and other metrics, get_signals() returns the current color signal strengths, get_draft_state() returns the current pick history and computed features, and get_archetype_fit(card, archetype) returns how well a card fits an archetype. The LLM can call these tools in sequence to gather the data it needs, then synthesize a recommendation grounded in actual data rather than hallucinated statistics.',
      technical: 'Implement tools as typed functions exposed to the LLM via a tool-calling API (OpenAI function calling or Anthropic tool use). Define each tool with a name, description, and JSON schema for its parameters and return type. For example: { name: "query_card_stats", description: "Returns performance statistics for a card by name", parameters: { name: { type: "string" } }, returns: { gih_wr: "number", oh_wr: "number", gd_wr: "number" } }. The orchestrator sends the user\'s question and the tool definitions to the LLM, receives tool call requests, executes them against the deterministic backend, returns the results, and lets the LLM generate the final response.',
      project: 'Implement a tool-calling recommendation engine. Define four tools: query_card_stats, get_signals, get_draft_state, and get_archetype_fit. Create the orchestrator loop that handles the LLM\'s tool call requests. Test with sample draft scenarios: "I have 5 black cards and 3 blue cards, the pack has a strong red card and a mediocre blue card — what should I pick?" Verify that the LLM calls the relevant tools and produces a recommendation grounded in the returned data. Compare the tool-calling LLM\'s recommendations against a simple GIH WR% ranking.',
      theory: 'Tool calling is an implementation of the ReAct (Reasoning + Acting) paradigm, where the LLM alternates between reasoning steps (thinking about what information it needs) and acting steps (calling tools to get that information). This addresses the fundamental limitation of LLMs as pure language models: they can generate plausible text but cannot guarantee factual accuracy. By grounding the LLM\'s reasoning in deterministic tool outputs, the system achieves the combination of natural language understanding (the LLM) and factual reliability (the tools). This is the architectural pattern behind modern AI agents and is rapidly becoming the standard approach for production LLM applications.'
    },
    prerequisites: ['deterministic-vs-llm'],
    relatedNodes: ['pipeline-architecture', 'feature-engineering'],
    tags: ['llm', 'tool-calling', 'agents', 'react', 'ai-engineering'],
    personaFit: ['developer', 'data-scientist'],
    quizItems: [
      {
        question: 'Why should an LLM call a database query tool instead of answering a question about card win rates from its training data?',
        options: [
          'Database queries are faster than LLM inference',
          'The LLM might hallucinate statistics, while the tool returns verified data',
          'LLMs cannot process numbers',
          'Tool calls are cheaper than LLM tokens'
        ],
        correctIndex: 1,
        explanation: 'LLMs can generate plausible but incorrect statistics from their training data. A card\'s GIH WR% might change between sets or even between updates of the same set\'s data. By calling a tool that queries the actual database, the LLM\'s response is grounded in current, verified data rather than potentially outdated or hallucinated numbers.'
      }
    ],
    unlocks: [],
    visual: {
      type: 'pipeline',
      description: 'A diagram showing the LLM in the center with bidirectional arrows to tool boxes arranged around it. Each tool box is labeled with its function (card stats, signals, draft state). The flow shows: user question → LLM reasoning → tool call → tool result → LLM synthesis → user answer.'
    }
  },
  {
    id: 'integration-order',
    title: 'Why the Boring Parts Come First',
    type: 'concept',
    summary: 'The most tempting features to build (the overlay UI, the AI recommendations) depend on the least glamorous parts (log parsing, identity resolution). Integration order matters.',
    difficulty: 'beginner',
    layers: {
      intuition: 'You want to build a treehouse. The fun part is the trapdoor, the rope ladder, and the telescope. But those all need walls, which need a platform, which needs structural beams bolted to the tree. If you start with the telescope, you have nothing to mount it on. The boring parts — measuring the tree, cutting beams, leveling the platform — enable the exciting parts. Software is the same. The overlay UI is exciting but useless without card data. Card data is useless without identity resolution. Identity resolution is useless without log parsing. The exciting parts depend on the boring parts, so the boring parts must come first.',
      system: 'In the pipeline architecture, each stage depends on the output of the preceding stage. The display stage cannot render card names if the identity stage has not resolved grpIds. The identity stage cannot resolve grpIds if the extraction stage has not parsed them from the log. This dependency chain defines the only valid integration order: extraction first, then identity, then display. Attempting to build in a different order (e.g., starting with the UI and mocking the data) creates throw-away work because the mock interfaces inevitably differ from the real data shapes that emerge when the upstream stages are actually built.',
      technical: 'Plan your build order as a reverse topological sort of the dependency graph. List every component and its dependencies: OverlayRenderer depends on CardResolver; CardResolver depends on LogParser and SQLiteDB; LogParser depends on LogTailer; SignalTracker depends on CardResolver. The valid build order starts with LogTailer, then LogParser, then SQLiteDB, then CardResolver, then OverlayRenderer and SignalTracker in parallel. Each component is built with a real integration test against its actual upstream dependency — not a mock. This is slower at first but eliminates the mock-reality mismatch problem.',
      project: 'Create a build plan document for your overlay. List every component, its dependencies, and its expected integration test. Order them by the topological sort. For each component, define "done" as: the component is built, tested with real upstream data, and emits data that the next component can consume. Execute the plan in order. After each component, run the growing integration test suite. Notice how each successive component is easier to build because its inputs are already verified.',
      theory: 'This principle is related to the concept of technical risk in project management. Integration risk — the risk that components do not work together — is the dominant risk in software projects. Building in dependency order (boring parts first) front-loads integration risk, exposing problems early when they are cheap to fix. Building in excitement order (fun parts first) defers integration risk until late in the project, when problems are expensive and demoralizing. This is the same insight behind the "walking skeleton" pattern in agile development: build a minimal end-to-end system first, then flesh it out incrementally.'
    },
    prerequisites: ['pipeline-architecture', 'vertical-slices'],
    relatedNodes: ['two-window-pattern', 'streaming-json-parser'],
    tags: ['methodology', 'planning', 'dependencies', 'risk', 'build-order'],
    personaFit: ['developer', 'educator', 'curious-beginner'],
    quizItems: [
      {
        question: 'A developer wants to build the overlay UI first because it is the most exciting part. Why is this a risky approach?',
        options: [
          'UIs are inherently harder to build than backend components',
          'The UI depends on data from upstream stages that do not exist yet — mocked interfaces will diverge from real data shapes',
          'UI code cannot be tested',
          'The UI will be too slow without backend optimization'
        ],
        correctIndex: 1,
        explanation: 'Building the UI first requires mocking the data it will display. But mock data shapes are guesses about what the upstream stages will produce. When the real parser and resolver are built, their actual output inevitably differs from the mocks — different field names, different structures, different edge cases. The UI code built against mocks becomes throw-away work. Building upstream stages first means the UI receives real data from day one.'
      },
      {
        question: 'In a dependency graph where A depends on B and B depends on C, what is the correct build order?',
        options: [
          'A, then B, then C — start with the end goal',
          'C, then B, then A — build dependencies before dependents',
          'Build all three in parallel for speed',
          'The order does not matter as long as all three are built'
        ],
        correctIndex: 1,
        explanation: 'Dependencies must exist before their dependents can be built and tested with real data. C has no dependencies, so it is built first. B depends on C, so it is built next and tested against the real output of C. A depends on B, so it is built last and tested against real output. This order front-loads integration risk and ensures each component is verified against actual upstream behavior.'
      }
    ],
    unlocks: [],
    visual: {
      type: 'pipeline',
      description: 'A vertical stack of components, ordered from bottom (LogTailer — least exciting) to top (AI Recommendations — most exciting). Arrows show dependencies flowing upward. A label reads "Build order: bottom to top."'
    }
  },
  {
    id: 'brace-counting',
    title: 'Character-by-Character Parsing',
    type: 'lesson',
    summary: 'Brace counting is the core technique of the streaming JSON parser: track the nesting depth of curly braces to detect when a complete JSON object has been emitted.',
    difficulty: 'intermediate',
    layers: {
      intuition: 'Regex cannot solve this problem — you cannot match nested braces with a regular expression. But counting can. You start at zero. Each opening parenthesis adds one to your count, each closing parenthesis subtracts one. When your count returns to zero, you know you have reached the end of a complete, balanced expression. Brace counting applies the same logic to JSON: an opening { increments the counter, a closing } decrements it, and when the counter returns to zero after being positive, you have found the end of a complete JSON object. The trick is that braces inside quoted strings do not count — they are part of the string value, not the structure.',
      system: 'Brace counting is the mechanism that the streaming JSON parser uses to detect object boundaries in the log stream. Without it, the parser would have no way to know where one JSON object ends and the next begins, because the log stream has no reliable delimiters between objects. The counter acts as a minimal stack — instead of pushing and popping a full stack data structure, it tracks only the depth, which is all that is needed for detecting complete objects. This minimalism makes the parser very fast — it processes one character at a time with O(1) work per character.',
      technical: 'The brace counter is an integer initialized to 0. On each character: if the character is { and inString is false, increment depth and start or continue buffering. If the character is } and inString is false, decrement depth; if depth reaches 0, the buffer contains a complete JSON object — emit it and clear the buffer. If the character is " and escape is false, toggle inString. If the character is \\ and inString is true, set escape to true for the next character. All other characters are added to the buffer if depth > 0. This five-rule algorithm is the entire parser.',
      project: 'Implement the brace counter as a standalone function: function findJsonObjects(text: string): string[]. It should return an array of complete JSON strings found in the input text. Write exhaustive tests: nested objects ({{}}), objects with string values containing braces ("key": "value with { brace }"), escaped quotes inside strings, multiple objects in sequence, and objects split across multiple calls (test by calling with partial text, then the remainder). Profile the function with a 10MB log file to verify it processes fast enough for real-time use.',
      theory: 'Brace counting is a degenerate case of pushdown automaton execution. A full pushdown automaton maintains a stack of symbols, but when the grammar only requires matching one type of bracket, the stack collapses to a single integer (the depth). This is because the stack only ever contains the same symbol repeated N times, so tracking N is sufficient. This optimization is common in practice — XML parsers often use a depth counter for the same reason. The insight generalizes: whenever a stack contains only one type of symbol, it can be replaced with a counter, reducing space complexity from O(n) to O(1) and simplifying the implementation.'
    },
    prerequisites: ['state-machines'],
    relatedNodes: ['streaming-json-parser', 'log-tailing'],
    tags: ['parsing', 'brace-counting', 'algorithms', 'character-by-character', 'json'],
    personaFit: ['developer', 'curious-beginner'],
    quizItems: [
      {
        question: 'Given the input {"a": "}"}, what is the brace depth after processing each character? (Start at 0)',
        options: [
          '0→1→1→1→1→1→1→0 — the closing brace inside the string is ignored',
          '0→1→1→1→1→0→0→-1 — both closing braces decrement',
          '0→1→1→1→1→1→0 — the parser fails on the inner brace',
          '0→1→2→2→2→1→0 — the inner brace increments depth'
        ],
        correctIndex: 0,
        explanation: 'The closing brace inside the string value "}" does not decrement the depth counter because the inString flag is true when that character is encountered. The parser correctly tracks that it entered a string when it saw the second quote, and exits the string at the fourth quote (after the closing brace character). Only the final } at position 7 decrements depth back to 0, signaling a complete object.'
      }
    ],
    unlocks: ['streaming-json-parser'],
    visual: {
      type: 'diagram',
      description: 'A horizontal string of characters with a depth counter shown below each character. The counter increments at { and decrements at }, with a special notation showing that braces inside strings (highlighted in a different color) do not affect the counter.'
    }
  }
];

export const pathways: Pathway[] = [
  {
    id: 'mtg-player-path',
    title: 'The Drafter\'s Data Edge',
    description: 'You already know how to draft. This path shows you the data behind the decisions — what signals really mean, how to read 17Lands, and how a draft overlay turns feel-reads into measured reads. You will not need to write code; you will gain an intuition for what the tools are doing and why the numbers matter.',
    persona: 'mtg-player',
    nodeIds: [
      'signals-as-data',
      'gih-winrate',
      'seventeen-lands-data',
      'color-signals',
      'draft-as-experiment',
      'archetype-detection',
      'deterministic-vs-llm',
      'feature-engineering'
    ],
    difficulty: 'beginner'
  },
  {
    id: 'developer-path',
    title: 'Building a Data Pipeline from Scratch',
    description: 'You know how to code. This path teaches you how to build a real-time data pipeline — from tailing a log file and parsing streaming JSON, through identity resolution with SQLite and API fallback, to rendering an overlay with pixel-aligned coordinates. You will encounter state machines, event emitters, the two-window pattern, and the discipline of building boring parts first.',
    persona: 'developer',
    nodeIds: [
      'state-machines',
      'brace-counting',
      'log-tailing',
      'streaming-json-parser',
      'typescript-schemas',
      'event-emitter',
      'pipeline-architecture',
      'sql-thinking',
      'card-identity',
      'vertical-slices',
      'integration-order',
      'two-window-pattern',
      'slot-aligned-overlay',
      'deterministic-vs-llm',
      'tool-calling'
    ],
    difficulty: 'intermediate'
  },
  {
    id: 'data-scientist-path',
    title: 'Exploring a New Domain with Data',
    description: 'You know statistics and analysis but not Magic: The Gathering. This path introduces the domain through its data: win rates, signal detection, archetype classification, and experimental design. You will learn how to turn raw game logs into features, how GIH WR% relates to conditional probability, and how each draft is a natural experiment in causal inference.',
    persona: 'data-scientist',
    nodeIds: [
      'signals-as-data',
      'gih-winrate',
      'seventeen-lands-data',
      'draft-as-experiment',
      'color-signals',
      'sql-thinking',
      'feature-engineering',
      'archetype-detection',
      'deterministic-vs-llm',
      'tool-calling'
    ],
    difficulty: 'intermediate'
  },
  {
    id: 'beginner-path',
    title: 'The Gentle Introduction',
    description: 'No assumptions about what you know. This path starts with the most intuitive ideas — what signals are, why types help, how quizzes help you learn — and builds gradually toward the technical concepts. Every step is grounded in analogy and everyday experience before introducing formal ideas.',
    persona: 'curious-beginner',
    nodeIds: [
      'narrative-design',
      'progressive-disclosure',
      'quiz-driven-learning',
      'signals-as-data',
      'state-machines',
      'gih-winrate',
      'seventeen-lands-data',
      'typescript-schemas',
      'sql-thinking',
      'event-emitter',
      'pipeline-architecture',
      'brace-counting',
      'streaming-json-parser',
      'deterministic-vs-llm'
    ],
    difficulty: 'beginner'
  },
  {
    id: 'builder-path',
    title: 'Build Your Own Draft Tool',
    description: 'You want to build a working draft overlay from zero to functional. This path is ordered by build dependency: you start with the foundational components that everything else depends on, connect them into a pipeline, layer on the display, and finish with AI-powered recommendations. Each step produces something that works and is testable.',
    persona: 'developer',
    nodeIds: [
      'state-machines',
      'brace-counting',
      'log-tailing',
      'streaming-json-parser',
      'sql-thinking',
      'card-identity',
      'gih-winrate',
      'seventeen-lands-data',
      'typescript-schemas',
      'event-emitter',
      'pipeline-architecture',
      'vertical-slices',
      'integration-order',
      'feature-engineering',
      'color-signals',
      'archetype-detection',
      'two-window-pattern',
      'slot-aligned-overlay',
      'progressive-disclosure',
      'deterministic-vs-llm',
      'tool-calling'
    ],
    difficulty: 'intermediate'
  }
];

export const agentRoles: AgentRole[] = [
  {
    id: 'log-watcher',
    name: 'Log Watcher',
    role: 'Monitors the MTGA Player.log file for new bytes and feeds raw text chunks into the pipeline.',
    deterministic: true,
    inputs: ['Player.log file path'],
    outputs: ['Raw text chunks'],
    exampleTask: 'Detect that 200 new bytes were appended to Player.log and emit them as a string chunk.'
  },
  {
    id: 'json-extractor',
    name: 'JSON Extractor',
    role: 'Streaming state machine that counts braces and extracts complete JSON objects from raw text.',
    deterministic: true,
    inputs: ['Raw text chunks'],
    outputs: ['Parsed JSON objects'],
    exampleTask: 'Feed a chunk containing a partial JSON object, buffer it, and emit the completed object when the closing brace arrives.'
  },
  {
    id: 'event-classifier',
    name: 'Event Classifier',
    role: 'Inspects parsed JSON objects and classifies them by MTGA event type (DraftPack, DraftPick, GameState, etc.).',
    deterministic: true,
    inputs: ['Parsed JSON objects'],
    outputs: ['Typed draft events'],
    exampleTask: 'Receive a JSON object, check its type field, and emit it as a DraftPack event with pack number and card IDs.'
  },
  {
    id: 'identity-resolver',
    name: 'Identity Resolver',
    role: 'Converts Arena grpIds into card names, colors, and metadata using SQLite lookup with Scryfall API fallback.',
    deterministic: true,
    inputs: ['Card grpIds'],
    outputs: ['Resolved card objects with name, color, rarity, type'],
    exampleTask: 'Resolve grpId 81243 to { name: "Aurelia\'s Vindicator", color: "W", rarity: "R" }.'
  },
  {
    id: 'ratings-enricher',
    name: 'Ratings Enricher',
    role: 'Attaches 17Lands win rate data (GIH WR%, ALSA, IWD) to resolved card objects.',
    deterministic: true,
    inputs: ['Resolved card objects', '17Lands CSV data'],
    outputs: ['Cards with win rate annotations'],
    exampleTask: 'Look up GIH WR% for "Aurelia\'s Vindicator" and attach { gihWr: 0.587, alsa: 1.8, iwd: 4.2 }.'
  },
  {
    id: 'signal-analyzer',
    name: 'Signal Analyzer',
    role: 'Computes color openness signals by comparing card availability against expected pick positions.',
    deterministic: true,
    inputs: ['Enriched pack contents', 'Pick history'],
    outputs: ['Color signal scores'],
    exampleTask: 'Detect that strong red cards are consistently late in the pack and output { red: 0.82, white: 0.34 } openness scores.'
  },
  {
    id: 'llm-advisor',
    name: 'LLM Advisor',
    role: 'Synthesizes structured pipeline data into natural language draft advice using tool-calling.',
    deterministic: false,
    inputs: ['Enriched cards', 'Signal scores', 'Draft history', 'Player context'],
    outputs: ['Natural language pick recommendation with reasoning'],
    exampleTask: 'Given pack contents with win rates and a red-open signal, recommend "Take Aurelia\'s Vindicator — red is wide open and this is the highest WR card by 3 points."'
  },
  {
    id: 'overlay-renderer',
    name: 'Overlay Renderer',
    role: 'Renders win rates and recommendations as a transparent overlay aligned to MTGA card positions.',
    deterministic: true,
    inputs: ['Enriched cards with positions', 'Recommendation text'],
    outputs: ['Visual overlay on screen'],
    exampleTask: 'Position a "57.2% GIH WR" label 4px below the third card slot in the draft pack display.'
  }
];

export const pipelineStages: PipelineStage[] = [
  {
    id: 'log-monitoring',
    name: 'Log Monitoring',
    description: 'Watch the MTGA Player.log file for new data using fs.watch or chokidar. Detect appended bytes and emit raw text chunks for downstream processing.',
    deterministic: true,
    agent: 'log-watcher',
    failureModes: [
      'Log file not found (MTGA not running)',
      'File permissions denied',
      'File path changed after MTGA update',
      'Rapid writes causing read buffer overflow'
    ],
    selfHealing: [
      'Retry with exponential backoff when file not found',
      'Search common MTGA log paths on startup',
      'Buffer incoming data to handle burst writes'
    ]
  },
  {
    id: 'json-extraction',
    name: 'JSON Extraction',
    description: 'Parse raw log text character by character using a streaming state machine. Track brace depth, string context, and escape sequences to extract complete JSON objects.',
    deterministic: true,
    agent: 'json-extractor',
    failureModes: [
      'Malformed JSON from corrupted log writes',
      'Extremely deeply nested objects exceeding stack',
      'Log format changes between MTGA versions',
      'Incomplete object at end of chunk boundary'
    ],
    selfHealing: [
      'Reset parser state on JSON.parse failure and skip to next object',
      'Set maximum depth limit with graceful rejection',
      'Buffer partial objects across chunk boundaries'
    ]
  },
  {
    id: 'event-classification',
    name: 'Event Classification',
    description: 'Examine parsed JSON objects and classify them by MTGA event type. Filter for draft-relevant events (DraftPack, DraftPick) and discard irrelevant log noise.',
    deterministic: true,
    agent: 'event-classifier',
    failureModes: [
      'Unknown event type from new MTGA version',
      'Missing type field in JSON object',
      'Duplicate events from log replay'
    ],
    selfHealing: [
      'Log unknown event types for analysis without crashing',
      'Skip objects without type fields gracefully',
      'Deduplicate events using timestamp and content hash'
    ]
  },
  {
    id: 'identity-resolution',
    name: 'Identity Resolution',
    description: 'Convert Arena grpId integers into full card metadata (name, color, rarity, type line) using a local SQLite database with Scryfall API as fallback.',
    deterministic: true,
    agent: 'identity-resolver',
    failureModes: [
      'grpId not found in local database (new set)',
      'Scryfall API rate limited or unavailable',
      'Database file corrupted or missing',
      'Multiple cards mapping to same grpId'
    ],
    selfHealing: [
      'Fall back to Scryfall API for unknown grpIds and cache result',
      'Queue failed lookups for retry with backoff',
      'Rebuild database from Scryfall bulk data on corruption',
      'Use most recent card printing for ambiguous IDs'
    ]
  },
  {
    id: 'ratings-enrichment',
    name: 'Ratings Enrichment',
    description: 'Attach 17Lands performance data (GIH WR%, OH WR%, ALSA, IWD) to each resolved card. Join on card name with fuzzy matching for naming discrepancies.',
    deterministic: true,
    agent: 'ratings-enricher',
    failureModes: [
      'Card name mismatch between Scryfall and 17Lands',
      '17Lands CSV not imported or outdated',
      'Card has insufficient sample size for reliable stats',
      'Split/double-faced cards with multiple names'
    ],
    selfHealing: [
      'Apply fuzzy string matching with edit distance threshold',
      'Flag low-sample-size cards with confidence intervals',
      'Try both face names for double-faced cards',
      'Prompt user to update 17Lands data when staleness detected'
    ]
  },
  {
    id: 'signal-analysis',
    name: 'Signal Analysis',
    description: 'Analyze the stream of draft events to compute color openness signals. Compare card availability against expected pick order to infer what colors neighboring drafters are taking.',
    deterministic: true,
    agent: 'signal-analyzer',
    failureModes: [
      'Insufficient picks to generate reliable signal',
      'Format where signals are inherently noisy',
      'Missing baseline data for expected pick positions'
    ],
    selfHealing: [
      'Show confidence level alongside signal scores',
      'Require minimum 4 picks before displaying signals',
      'Fall back to rarity-based expectations when 17Lands data unavailable'
    ]
  },
  {
    id: 'llm-synthesis',
    name: 'LLM Synthesis',
    description: 'Feed structured pipeline output to a language model that synthesizes pick advice using tool-calling. The LLM queries deterministic tools for facts and provides contextual reasoning.',
    deterministic: false,
    agent: 'llm-advisor',
    failureModes: [
      'LLM API unavailable or rate limited',
      'Hallucinated win rate or card name',
      'Response latency exceeding draft timer',
      'Context window overflow with long draft history'
    ],
    selfHealing: [
      'Fall back to deterministic ranking when LLM unavailable',
      'Cross-validate LLM-cited stats against pipeline data',
      'Set strict timeout and serve cached/deterministic result on expiry',
      'Summarize draft history to fit context window'
    ]
  },
  {
    id: 'overlay-rendering',
    name: 'Overlay Rendering',
    description: 'Render a transparent overlay window aligned to MTGA card positions. Display win rates, signal indicators, and recommendations using a slot-aligned coordinate system.',
    deterministic: true,
    agent: 'overlay-renderer',
    failureModes: [
      'MTGA window resized or moved during draft',
      'Overlay obscuring important game UI elements',
      'Screen resolution or DPI scaling mismatch',
      'Multiple monitors with different scaling'
    ],
    selfHealing: [
      'Recalculate slot positions on window resize event',
      'Provide toggle to hide/show overlay sections',
      'Detect DPI scaling from system settings',
      'Allow manual offset adjustment for edge cases'
    ]
  }
];
