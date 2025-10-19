
import React from 'react';
import { Book } from '../types';
import { StarRating } from './StarRating';

interface BookCardProps {
  book: Book;
  onSelect: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(book)}
      className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 cursor-pointer flex flex-col group"
    >
      <div className="relative h-64 sm:h-72">
        <img
          src={book.coverImage}
          alt={`غلاف كتاب ${book.title}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-40 transition-all duration-300"></div>
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
