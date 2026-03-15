import React, { useState } from 'react';
import { ChevronDown, ChevronRight, MessageSquare } from 'lucide-react';
import { tweetSeries } from '../data/tweets';

const TweetsPage: React.FC = () => {
  const [expandedSeries, setExpandedSeries] = useState<Set<string>>(
    new Set([tweetSeries[0]?.id])
  );

  const toggleSeries = (id: string) => {
    setExpandedSeries((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Group tweets by threadGroup within a series
  const groupTweets = (tweets: typeof tweetSeries[0]['tweets']) => {
    const groups: { group: string | null; tweets: typeof tweets }[] = [];
    let currentGroup: string | null = null;
    let currentTweets: typeof tweets = [];

    tweets.forEach((tweet) => {
      const tg = tweet.threadGroup || null;
      if (tg !== currentGroup) {
        if (currentTweets.length > 0) {
          groups.push({ group: currentGroup, tweets: currentTweets });
        }
        currentGroup = tg;
        currentTweets = [tweet];
      } else {
        currentTweets.push(tweet);
      }
    });
    if (currentTweets.length > 0) {
      groups.push({ group: currentGroup, tweets: currentTweets });
    }
    return groups;
  };

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
        Tweet Threads
      </h1>
      <p
        style={{
          color: 'var(--text-dim)',
          fontSize: '0.95rem',
          marginBottom: 32,
          maxWidth: 640,
          lineHeight: 1.7,
        }}
      >
        Draft Academy concepts distilled into tweet-sized explanations. Each series
        builds a complete idea in short, connected bursts.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {tweetSeries.map((series) => {
          const isExpanded = expandedSeries.has(series.id);
          const tweetGroups = groupTweets(series.tweets);

          return (
            <div
              key={series.id}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                overflow: 'hidden',
              }}
            >
              {/* Series Header */}
              <button
                onClick={() => toggleSeries(series.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 12,
                  padding: '20px 24px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--font)',
                }}
              >
                <div style={{ marginTop: 3, flexShrink: 0, color: 'var(--accent-light)' }}>
                  {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <h2
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      color: 'var(--text)',
                      marginBottom: 6,
                    }}
                  >
                    {series.title}
                  </h2>
                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--text-dim)',
                      lineHeight: 1.6,
                    }}
                  >
                    {series.premise}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 8,
                      color: 'var(--text-muted)',
                      fontSize: '0.8rem',
                    }}
                  >
                    <MessageSquare size={13} />
                    {series.tweets.length} tweets
                  </div>
                </div>
              </button>

              {/* Expanded Tweets */}
              {isExpanded && (
                <div
                  style={{
                    padding: '0 24px 24px',
                    borderTop: '1px solid var(--border)',
                  }}
                >
                  {/* Visual Notes */}
                  {series.visualNotes && (
                    <p
                      style={{
                        fontSize: '0.82rem',
                        color: 'var(--text-muted)',
                        fontStyle: 'italic',
                        padding: '14px 0 18px',
                        lineHeight: 1.6,
                      }}
                    >
                      Visual notes: {series.visualNotes}
                    </p>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {tweetGroups.map((group, gi) => (
                      <div
                        key={gi}
                        style={{
                          borderLeft: group.group
                            ? '3px solid var(--accent)'
                            : '3px solid transparent',
                          paddingLeft: group.group ? 16 : 0,
                        }}
                      >
                        {group.group && (
                          <div
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'var(--accent-light)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                              marginBottom: 8,
                            }}
                          >
                            {group.group.replace(/-/g, ' ')}
                          </div>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {group.tweets.map((tweet) => (
                            <div
                              key={tweet.id}
                              style={{
                                background: 'var(--bg-surface)',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '14px 16px',
                              }}
                            >
                              <p
                                style={{
                                  fontSize: '0.9rem',
                                  color: 'var(--text)',
                                  lineHeight: 1.7,
                                }}
                              >
                                {tweet.text}
                              </p>
                              {tweet.visualNote && (
                                <p
                                  style={{
                                    fontSize: '0.78rem',
                                    color: 'var(--text-muted)',
                                    fontStyle: 'italic',
                                    marginTop: 8,
                                  }}
                                >
                                  {tweet.visualNote}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TweetsPage;
