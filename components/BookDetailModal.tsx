import React, { useState } from 'react';
import { Book } from '../types';
import { CloseIcon, CreditCardIcon } from './icons';
import { StarRating } from './StarRating';

interface BookDetailModalProps {
  book: Book | null;
  onClose: () => void;
  onUpdateBook: (updatedBook: Book) => void;
  onBuyNow: () => void;
}

const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose, onUpdateBook, onBuyNow }) => {
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);

  if (!book) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === '') return;
    const comment = {
      id: Date.now(),
      user: 'مستخدم جديد',
      avatar: 'https://i.pravatar.cc/150?u=newuser',
      text: newComment,
    };
    const updatedBook = { ...book, comments: [...book.comments, comment] };
    onUpdateBook(updatedBook);
    setNewComment('');
  };

  const handleSetRating = (rating: number) => {
    setUserRating(rating);
    // In a real app, you would average this with existing ratings
    const updatedBook = {
      ...book,
      rating: (book.rating * book.ratingsCount + rating) / (book.ratingsCount + 1),
      ratingsCount: book.ratingsCount + 1,
    };
    onUpdateBook(updatedBook);
  };
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-50 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 z-10"
        >
          <CloseIcon className="w-8 h-8" />
        </button>

        <div className="w-full md:w-1/3 flex-shrink-0">
          <img
            src={book.coverImage}
            alt={`غلاف كتاب ${book.title}`}
            className="w-full h-full object-cover rounded-r-lg md:rounded-r-none md:rounded-l-lg"
          />
        </div>

        <div className="p-6 md:p-8 flex-grow">
          <h2 className="text-3xl font-bold text-sky-800 mb-2">{book.title}</h2>
          <p className="text-lg text-gray-600 mb-4">{book.author}</p>
          <div className="flex items-center mb-6">
            <StarRating rating={book.rating} />
            <span className="text-gray-600 mr-2">{book.rating.toFixed(1)}</span>
            <span className="text-gray-500 text-sm">{`(${book.ratingsCount} تقييم)`}</span>
          </div>
          <p className="text-gray-700 leading-relaxed mb-6">{book.description}</p>
          
          <div className="flex items-center justify-between bg-sky-50 p-4 rounded-lg mb-6">
            <span className="text-2xl font-bold text-sky-700">{`$${book.price}`}</span>
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition text-sm">عرض PDF</button>
              <button className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition text-sm">تحميل الكتاب</button>
               <button 
                onClick={onBuyNow}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition text-sm"
               >
                <CreditCardIcon className="w-5 h-5" />
                <span>شراء الآن</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-800 border-b pb-2">التقييمات والتعليقات</h4>
             <div>
                <p className="font-semibold mb-2">أضف تقييمك:</p>
                <StarRating rating={userRating} setRating={handleSetRating} className="w-7 h-7" />
            </div>
            <div className="space-y-4 max-h-48 overflow-y-auto pr-2">
              {book.comments.length > 0 ? book.comments.map(comment => (
                <div key={comment.id} className="flex items-start space-x-3 rtl:space-x-reverse">
                  <img src={comment.avatar} alt={comment.user} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold text-gray-800">{comment.user}</p>
                    <p className="text-gray-600">{comment.text}</p>
                  </div>
                </div>
              )) : <p className="text-gray-500">لا توجد تعليقات بعد.</p>}
            </div>
            <form onSubmit={handleAddComment} className="flex space-x-2 rtl:space-x-reverse pt-4 border-t">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="أضف تعليقًا..."
                className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <button type="submit" className="px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 transition">
                إرسال
              </button>
            </form>
          </div>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
    `}</style>
    </div>
  );
};

export default BookDetailModal;