export type NodeType = 'concept' | 'lesson' | 'project' | 'puzzle' | 'quiz' | 'theory' | 'example' | 'tool' | 'pathway' | 'persona';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type Layer = 'intuition' | 'system' | 'technical' | 'project' | 'theory';
export type Persona = 'curious-beginner' | 'data-scientist' | 'developer' | 'mtg-player' | 'educator';

export interface ContentNode {
  id: string;
  title: string;
  type: NodeType;
  summary: string;
  difficulty: Difficulty;
  layers: {
    intuition?: string;
    system?: string;
    technical?: string;
    project?: string;
    theory?: string;
  };
  prerequisites: string[];
  relatedNodes: string[];
  tags: string[];
  personaFit: Persona[];
  quizItems?: QuizItem[];
  unlocks?: string[];
  visual?: VisualSpec;
}

export interface QuizItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface VisualSpec {
  type: 'pipeline' | 'comparison' | 'diagram' | 'card' | 'graph';
  description: string;
}

export interface Pathway {
  id: string;
  title: string;
  description: string;
  persona: Persona;
  nodeIds: string[];
  difficulty: Difficulty;
}

export interface TweetSeries {
  id: string;
  title: string;
  premise: string;
  tweets: Tweet[];
  visualNotes: string;
  websiteLinks: string[];
}

export interface Tweet {
  id: string;
  text: string;
  threadGroup?: string;
  visualNote?: string;
}

export interface AgentRole {
  id: string;
  name: string;
  role: string;
  deterministic: boolean;
  inputs: string[];
  outputs: string[];
  exampleTask: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  description: string;
  deterministic: boolean;
  agent?: string;
  failureModes: string[];
  selfHealing: string[];
}
