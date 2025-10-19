
import React from 'react';
import { StarIcon } from './icons';

interface StarRatingProps {
  rating: number;
  setRating?: (rating: number) => void;
  totalStars?: number;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  setRating,
  totalStars = 5,
  className = 'h-5 w-5',
}) => {
  return (
    <div className="flex items-center space-x-1 rtl:space-x-reverse">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            disabled={!setRating}
            onClick={() => setRating && setRating(starValue)}
            className={`transition-colors ${
              setRating ? 'cursor-pointer' : ''
            }`}
          >
            <StarIcon
              className={`${className} ${
                starValue <= rating
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
