import React, { useState } from 'react';
import { Book } from '../types';
import { StarRating } from './StarRating';
import { ShoppingCartIcon, CheckIcon } from './icons';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  isAddedToCart: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, onSelect, onAddToCart, isAddedToCart }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the modal from opening
    if (!isAddedToCart) {
      onAddToCart(book);
      setShowConfirmation(true);
      setTimeout(() => {
        setShowConfirmation(false);
      }, 2000); // Hide the message after 2 seconds
    }
  };

  return (
    <div
      onClick={() => onSelect(book)}
      className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer flex flex-col group relative"
    >
      <div className="relative h-60 sm:h-72">
        <img
          src={book.coverImage}
          alt={`غلاف كتاب ${book.title}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>

        {/* Confirmation message with animation */}
        <div
          aria-live="polite"
          className={`absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap transition-all duration-300 pointer-events-none ${
            showConfirmation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          تمت الإضافة للسلة!
        </div>

        <button
          onClick={handleAddToCartClick}
          disabled={isAddedToCart}
          className={`absolute top-3 right-3 h-10 w-10 rounded-full flex items-center justify-center shadow-lg transform scale-100 md:scale-0 md:group-hover:scale-100 transition-transform duration-200 ${
            isAddedToCart
              ? 'bg-green-500 cursor-not-allowed'
              : 'bg-sky-600 hover:bg-sky-700'
          }`}
          aria-label={isAddedToCart ? 'تمت الإضافة للسلة' : 'أضف إلى السلة'}
        >
          {isAddedToCart ? (
            <CheckIcon className="h-6 w-6 text-white" />
          ) : (
            <ShoppingCartIcon className="h-6 w-6 text-white" />
          )}
        </button>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-1 truncate">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{book.author}</p>
        <div className="mt-auto flex justify-between items-center">
          <StarRating rating={book.rating} />
          <span className="text-sm text-gray-500">{`(${book.ratingsCount})`}</span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;