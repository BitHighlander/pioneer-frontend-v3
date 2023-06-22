import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  count?: number;
  size?: number;
}

export default function StarRating({ rating, setRating, count, size }: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="star-container">
      {[...Array(count || 5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <label
            key={index}
            style={{
              color: ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9',
            }}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
          >
            <input type="radio" name="rating" onChange={() => setRating(ratingValue)} value={ratingValue} style={{ display: 'none' }} />
            <FaStar cursor="pointer" size={size || 20} />
          </label>
        );
      })}
    </div>
  );
}
