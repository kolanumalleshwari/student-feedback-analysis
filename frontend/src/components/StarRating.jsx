import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, onChange, readOnly = false, size = 18 }) {
  const [hoverRating, setHoverRating] = useState(0);

  const currentDisplay = hoverRating || rating;

  return (
    <div className="stars-display">
      {[1, 2, 3, 4, 5].map((starValue) => {
        const isFilled = starValue <= currentDisplay;
        return (
          <Star
            key={starValue}
            size={size}
            className={readOnly ? '' : 'star-interactive'}
            fill={isFilled ? '#f59e0b' : 'none'}
            color={isFilled ? '#f59e0b' : '#cbd5e1'}
            strokeWidth={1.8}
            onMouseEnter={() => !readOnly && setHoverRating(starValue)}
            onMouseLeave={() => !readOnly && setHoverRating(0)}
            onClick={() => !readOnly && onChange && onChange(starValue)}
          />
        );
      })}
    </div>
  );
}
