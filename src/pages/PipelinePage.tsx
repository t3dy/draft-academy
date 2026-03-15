import React, { useState } from 'react';
import { AlertTriangle, Shield, Cpu, Brain, ArrowRight } from 'lucide-react';
import { agentRoles, pipelineStages } from '../data/content';
import PipelineDiagram from '../components/PipelineDiagram';
import AgentCard from '../components/AgentCard';

const PipelinePage: React.FC = () => {
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

  const selectedStage = pipelineStages.find((s) => s.id === selectedStageId);

  const deterministicStages = pipelineStages.filter((s) => s.deterministic);
  const probabilisticStages = pipelineStages.filter((s) => !s.deterministic);

  return (
    <div className="container fade-in" style={{ paddingTop: 40, paddingBottom: 60 }}>
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          marginBottom: 8,
        }}
      >
        The Draft Pipeline
      </h1>
      <p
        style={{
          color: 'var(--text-dim)',
          fontSize: '0.95rem',
          marginBottom: 36,
          maxWidth: 700,
          lineHeight: 1.7,
        }}
      >
        The MTG position solver pipeline transforms raw MTGA log data into
        real-time draft recommendations. Eight stages, each with clear inputs,
        outputs, and failure modes. Click any stage to see how it works.
      </p>

      {/* Pipeline Diagram */}
      <section style={{ marginBottom: 40 }}>
        <PipelineDiagram
          stages={pipelineStages}
          activeStage={selectedStageId ?? undefined}
          onStageClick={(stageId: string) =>
            setSelectedStageId(stageId === selectedStageId ? null : stageId)
          }
        />
      </section>

      {/* Selected Stage Detail */}
      {selectedStage && (
        <section
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--accent)',
            borderRadius: 'var(--radius)',
            padding: '28px 24px',
            marginBottom: 40,
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text)' }}>
              {selectedStage.name}
            </h2>
            <span
              className="badge"
              style={{
                background: selectedStage.deterministic
                  ? 'var(--green-dim)'
                  : 'var(--orange-dim)',
                color: selectedStage.deterministic
                  ? 'var(--green)'
                  : 'var(--orange)',
              }}
            >
              {selectedStage.deterministic ? 'Deterministic' : 'Probabilistic'}
            </span>
          </div>
          <p
            style={{
              color: 'var(--text-dim)',
              fontSize: '0.95rem',
              lineHeight: 1.7,
              marginBottom: 24,
            }}
          >
            {selectedStage.description}
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {/* Failure Modes */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '18px 20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 12,
                  color: 'var(--red)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                }}
              >
                <AlertTriangle size={15} /> Failure Modes
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {selectedStage.failureModes.map((fm, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-dim)',
                      lineHeight: 1.5,
                      paddingLeft: 14,
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        color: 'var(--red)',
                      }}
                    >
                      -
                    </span>
                    {fm}
                  </li>
                ))}
              </ul>
            </div>

            {/* Self-Healing */}
            <div
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '18px 20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 12,
                  color: 'var(--green)',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                }}
              >
                <Shield size={15} /> Self-Healing
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}
              >
                {selectedStage.selfHealing.map((sh, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--text-dim)',
                      lineHeight: 1.5,
                      paddingLeft: 14,
                      position: 'relative',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        left: 0,
                        color: 'var(--green)',
                      }}
                    >
                      +
                    </span>
                    {sh}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Deterministic vs Probabilistic */}
      <section style={{ marginBottom: 48 }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: 8,
            color: 'var(--text)',
          }}
        >
          Deterministic vs Probabilistic
        </h2>
        <p
          style={{
            color: 'var(--text-dim)',
            fontSize: '0.95rem',
            lineHeight: 1.7,
            marginBottom: 24,
            maxWidth: 640,
          }}
        >
          Most pipeline stages are deterministic: same input always produces same
          output. Only the LLM synthesis stage is probabilistic. Knowing the boundary
          matters for testing, debugging, and trust.
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          {/* Deterministic Column */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--green-dim)',
                  color: 'var(--green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Cpu size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--green)' }}>
                  Deterministic
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Same input, same output. Always.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {deterministicStages.map((stage) => (
                <div
                  key={stage.id}
                  style={{
                    padding: '10px 14px',
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    fontSize: '0.88rem',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onClick={() =>
                    setSelectedStageId(stage.id === selectedStageId ? null : stage.id)
                  }
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--green)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  {stage.name}
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 16,
                padding: '10px 14px',
                background: 'var(--green-dim)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                color: 'var(--green)',
                lineHeight: 1.5,
              }}
            >
              Testable with unit tests. Reproducible. No API keys needed.
            </div>
          </div>

          {/* Arrow */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowRight size={24} style={{ color: 'var(--text-muted)' }} />
          </div>

          {/* Probabilistic Column */}
          <div
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--orange-dim)',
                  color: 'var(--orange)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Brain size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--orange)' }}>
                  Probabilistic
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Context-dependent. Requires interpretation.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {probabilisticStages.map((stage) => (
                <div
                  key={stage.id}
                  style={{
                    padding: '10px 14px',
                    background: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border)',
                    fontSize: '0.88rem',
                    color: 'var(--text)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onClick={() =>
                    setSelectedStageId(stage.id === selectedStageId ? null : stage.id)
                  }
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--orange)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  {stage.name}
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 16,
                padding: '10px 14px',
                background: 'var(--orange-dim)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                color: 'var(--orange)',
                lineHeight: 1.5,
              }}
            >
              Requires LLM API. Output varies. Cross-validate against deterministic data.
            </div>
          </div>
        </div>
      </section>

      {/* Agent Swarm */}
      <section style={{ marginBottom: 40 }}>
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: 8,
            color: 'var(--text)',
          }}
        >
          Agent Swarm
        </h2>
        <p
          style={{
            color: 'var(--text-dim)',
            fontSize: '0.95rem',
            lineHeight: 1.7,
            marginBottom: 24,
            maxWidth: 640,
          }}
        >
          Each pipeline stage is operated by a specialized agent. Most agents are
          deterministic processors; one is an LLM that synthesizes structured data
          into natural language advice.
        </p>
        <div className="card-grid">
          {agentRoles.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default PipelinePage;
