import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Book } from './types';
import { BOOKS, CATEGORIES } from './constants';
import BookCard from './components/BookCard';
import CategoryFilter from './components/CategoryFilter';
import BookDetailModal from './components/BookDetailModal';
import { SearchIcon, ShoppingCartIcon } from './components/icons';

/**
 * Calculates the Levenshtein distance between two strings, which is the number of
 * single-character edits (insertions, deletions, or substitutions) required to
 * change one string into the other.
 * @param a The first string.
 * @param b The second string.
 * @returns The Levenshtein distance.
 */
const levenshteinDistance = (a: string, b: string): number => {
    const an = a ? a.length : 0;
    const bn = b ? b.length : 0;
    if (an === 0) return bn;
    if (bn === 0) return an;

    const matrix = Array.from({ length: bn + 1 }, () => Array(an + 1).fill(0));

    for (let i = 0; i <= bn; i++) {
        matrix[i][0] = i;
    }
    for (let j = 0; j <= an; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= bn; i++) {
        for (let j = 1; j <= an; j++) {
            const cost = b[i - 1] === a[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,       // Deletion
                matrix[i][j - 1] + 1,       // Insertion
                matrix[i - 1][j - 1] + cost // Substitution
            );
        }
    }

    return matrix[bn][an];
};


const App: React.FC = () => {
  const [books, setBooks] = useState<Book[]>(BOOKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cart, setCart] = useState<Book[]>([]);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Load cart from localStorage on initial render
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('remas_bookstore_cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('remas_bookstore_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredBooks = useMemo(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase().trim();

    const categoryFilteredBooks = books.filter((book) =>
      selectedCategory === 'الكل' ? true : book.category === selectedCategory
    );

    if (!lowercasedSearchTerm) {
      return categoryFilteredBooks;
    }

    // Allow for 1 misspelling for short words, 2 for longer ones.
    const fuzzyThreshold = lowercasedSearchTerm.length < 5 ? 1 : 2;

    return categoryFilteredBooks.filter((book) => {
      const lowercasedTitle = book.title.toLowerCase();
      const lowercasedAuthor = book.author.toLowerCase();

      // 1. Prioritize exact substring match for speed and relevance.
      if (
        lowercasedTitle.includes(lowercasedSearchTerm) ||
        lowercasedAuthor.includes(lowercasedSearchTerm)
      ) {
        return true;
      }

      // 2. If no exact match, perform fuzzy search on individual words.
      const searchWords = lowercasedSearchTerm.split(' ');
      const titleWords = lowercasedTitle.split(' ');
      const authorWords = lowercasedAuthor.split(' ');
      const allWords = [...new Set([...titleWords, ...authorWords])];

      for (const searchWord of searchWords) {
        for (const word of allWords) {
          if (levenshteinDistance(word, searchWord) <= fuzzyThreshold) {
            return true;
          }
        }
      }

      return false;
    });
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length > 0) {
      const lowercasedValue = value.toLowerCase();
      const allTitlesAndAuthors = [...new Set(BOOKS.flatMap(book => [book.title, book.author]))];

      const filteredSuggestions = allTitlesAndAuthors
        .filter(item => item.toLowerCase().includes(lowercasedValue))
        .slice(0, 7); // Limit to 7 suggestions

      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const getHighlightedText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <strong key={i} className="font-bold text-sky-600">{part}</strong>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const handleAddToCart = (bookToAdd: Book) => {
    setCart(prevCart => {
      if (prevCart.find(book => book.id === bookToAdd.id)) {
        return prevCart; // Already in cart
      }
      return [...prevCart, bookToAdd];
    });
  };

  const handleBuyNow = () => {
    if (cart.length === 0) {
      alert('سلة الشراء فارغة! أضف كتبًا إلى السلة أولاً قبل الشراء.');
      return;
    }
    
    const bookCount = cart.length;
    const total = cart.reduce((sum, book) => sum + book.price, 0).toFixed(2);
    
    alert(`شكرًا لك! تم إتمام عملية شراء ${bookCount} كتاب مقابل $${total}. سيتم الآن تفريغ سلة التسوق.`);
    
    setCart([]); // This will clear the cart and trigger the useEffect to update localStorage
    handleCloseModal();
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sans" style={{fontFamily: 'Tajawal, sans-serif'}}>
       <link rel="preconnect" href="https://fonts.googleapis.com" />
       <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
       <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet" />

      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-sky-700">
            متجر ريماس للكتب
          </h1>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div ref={searchContainerRef} className="relative flex-grow sm:w-64 md:w-80">
                <input
                  type="text"
                  placeholder="ابحث عن كتاب، مؤلف..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => searchTerm && suggestions.length > 0 && setShowSuggestions(true)}
                  className="w-full p-2 pr-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  autoComplete="off"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-2 text-right cursor-pointer hover:bg-sky-100 transition-colors duration-150"
                      >
                        {getHighlightedText(suggestion, searchTerm)}
                      </li>
                    ))}
                  </ul>
                )}
            </div>
            <button className="relative p-2 text-gray-600 hover:text-sky-700">
                <ShoppingCartIcon className="h-7 w-7" />
                {cart.length > 0 && (
                    <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center transform -translate-y-1/2 translate-x-1/2">
                        {cart.length}
                    </span>
                )}
            </button>
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
              <BookCard 
                key={book.id} 
                book={book} 
                onSelect={handleSelectBook} 
                onAddToCart={handleAddToCart}
                isAddedToCart={cart.some(item => item.id === book.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700">لم يتم العثور على كتب</h2>
            <p className="text-gray-500 mt-2">حاول تغيير فلتر البحث أو التصنيف أو التأكد من الإملاء.</p>
          </div>
        )}
      </main>
      
      <BookDetailModal 
        book={selectedBook} 
        onClose={handleCloseModal} 
        onUpdateBook={handleUpdateBook} 
        onBuyNow={handleBuyNow}
      />
    </div>
  );
};

export default App;