import React from 'react';
import { ThumbsUp, Minus, ThumbsDown } from 'lucide-react';

export default function SentimentBadge({ sentiment }) {
  const norm = (sentiment || 'Neutral').toLowerCase();

  if (norm === 'positive') {
    return (
      <span className="badge badge-positive">
        <ThumbsUp size={12} /> Positive
      </span>
    );
  }

  if (norm === 'negative') {
    return (
      <span className="badge badge-negative">
        <ThumbsDown size={12} /> Negative
      </span>
    );
  }

  return (
    <span className="badge badge-neutral">
      <Minus size={12} /> Neutral
    </span>
  );
}
