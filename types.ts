
export interface Comment {
  id: number;
  user: string;
  avatar: string;
  text: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  category: string;
  rating: number;
  ratingsCount: number;
  price: number;
  comments: Comment[];
}
