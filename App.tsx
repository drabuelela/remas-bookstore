
import React, { useState, useMemo } from 'react';
import { Book } from './types';
import { BOOKS, CATEGORIES } from './constants';
import BookCard from './components/BookCard';
import CategoryFilter from './components/CategoryFilter';
import BookDetailModal from './components/BookDetailModal';
import { SearchIcon } from './components/icons';

const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(BOOKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) =>
        selectedCategory === 'الكل' ? true : book.category === selectedCategory
      )
      .filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [books, searchTerm, selectedCategory]);

  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const handleUpdateBook = (updatedBook: Book) => {
    setBooks(books.map(b => b.id === updatedBook.id ? updatedBook : b));
    if (selectedBook && selectedBook.id === updatedBook.id) {
        setSelectedBook(updatedBook);
    }
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sans" style={{fontFamily: 'Tajawal, sans-serif'}}>
       <link rel="preconnect" href="https://fonts.googleapis.com" />
       {/* FIX: The value "true" is not assignable to type 'CrossOrigin'. Changed to an empty string which is a valid value. */}
       <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
       <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet" />

      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-sky-700 mb-4 sm:mb-0">
            متجر ريماس للكتب
          </h1>
          <div className="relative w-full sm:w-64 md:w-80">
            <input
              type="text"
              placeholder="ابحث عن كتاب، مؤلف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pr-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <CategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onSelect={handleSelectBook} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700">لم يتم العثور على كتب</h2>
            <p className="text-gray-500 mt-2">حاول تغيير فلتر البحث أو التصنيف.</p>
          </div>
        )}
      </main>
      
      <BookDetailModal book={selectedBook} onClose={handleCloseModal} onUpdateBook={handleUpdateBook} />
    </div>
  );
};

export default App;
