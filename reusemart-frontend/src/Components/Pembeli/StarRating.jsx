import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

const StarRating = ({ onRate }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);

  const handleClick = (value) => {
    setRating(value);
    onRate?.(value); // callback jika diberikan
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span>Berikan rating untuk produk ini:</span>
      <div style={{ display: 'flex', cursor: 'pointer' }}>
        {[...Array(5)].map((_, index) => {
          const starValue = index + 1;
          return (
            <label key={starValue}>
              <input
                type="radio"
                name="rating"
                value={starValue}
                onClick={() => handleClick(starValue)}
                style={{ display: 'none' }}
              />
              <FaStar
                size={24}
                color={starValue <= (hover || rating) ? 'gold' : 'gray'}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(null)}
              />
            </label>
          );
        })}
      </div>
      <span>{rating > 0 ? `(${rating})` : ''}</span>
    </div>
  );
};

export default StarRating;
