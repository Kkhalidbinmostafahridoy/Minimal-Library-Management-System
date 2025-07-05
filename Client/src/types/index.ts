export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string;
  isbn: string;
  copies: number;
  available: boolean;
}

export interface BorrowRecord {
  id?: number;
  bookId: number;
  bookTitle: string;
  isbn: string;
  quantity: number;
  dueDate: string;
}

export interface BorrowSummary {
  bookTitle: string;
  isbn: string;
  totalQuantityBorrowed: number;
}
